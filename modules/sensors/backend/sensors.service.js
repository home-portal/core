const _ = require("lodash");
const moment = require("moment");
const Moleculer = require("moleculer");
const { writeToTemp } = require("../../../backend/utils");
const mqtt = require('mqtt')

module.exports = {
	name: "sensors",
	mixins: [Moleculer.Mixins.ModuleConfigMixin, Moleculer.Mixins.ModuleSettingsMixin],

	actions: {
		sensorsData(ctx) {
			return this.sensorsData;
		}
	},

	methods: {
		getSensorsDataByTopic(topic) {
			return Object.values(this.sensorsData).find(d => d.topic == topic);
		},

		getDeviceByID(id) {
			return this.settings.devices.find(d => d.id == id);
		},

		async processMQTTMessage(topic, message) {
			const data = this.getSensorsDataByTopic(topic);
			if (data) {
				const dev = this.getDeviceByID(data.id);
				if (dev) {
					if (dev.payloadType == "json") {
						message = JSON.parse(message);
					}
					switch (dev.type) {
						case "temphum": {
							data.temperature = Number(_.get(message, dev.value1Path));
							data.humidity = Number(_.get(message, dev.value2Path));
							break;
						}
						default: {
							data.value = Number(_.get(message, dev.valuePath));
						}
					}

					this.logger.info("Sensor data updated", data);
					this.broker.broadcast("sensors.data.updated", data);
				}
			}
		}
	},

	created() {
		this.mqttClient = null;
		this.sensorsData = {};
	},

	async started() {
		// Load protocol handlers of devices
		await this.Promise.mapSeries(this.settings.devices, async dev => {
			if (dev.protocol == "mqtt") {
				this.sensorsData[dev.id] = {
					id: dev.id,
					type: dev.type,
					name: dev.name,
					topic: dev.topic
				};

				if (!this.mqttClient) {
					this.logger.info(`Connecting to ${this.settings.mqtt}...`);
					this.mqttClient = mqtt.connect(this.settings.mqtt);
					this.mqttClient.on('message', (topic, message) => {
						//this.logger.info("Incoming MQTT message", topic, message.toString());
						this.processMQTTMessage(topic, message);
					});
				}
				this.mqttClient.on("connect", () => {
					this.logger.info(`Subscribing to ${dev.topic}...`);
					this.mqttClient.subscribe(dev.topic, (err) => {
						if (err) {
							this.logger.error("Unable to subscribe MQTT topic", dev.topic);
						}
					});
				});
			} else {
				this.logger.warn(`Unknow device protocol '${dev.protocol}'. Skipping...`);
			}
		});
	},

	async stopped() {
		if (this.mqttClient) {
			this.logger.info("Closing MQTT connection...");
			this.mqttClient.end();
			this.mqttClient = null;
		}
	}
};
