const _ = require("lodash");
const fetch = require("node-fetch");
const Moleculer = require("moleculer");

const BASE_URL = "http://api.openweathermap.org/data/2.5";

module.exports = {
	name: "weather",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin],

	actions: {
		get() {
			return this.result;
		},

		refresh() {
			return this.refresh();
		}
	},

	methods: {
		async refresh() {
			const lang = this.settings.language || "en";
			const unit = this.settings.unit || "metric";
			const location = encodeURIComponent(this.settings.location || "London");
			let apiParam = "";
			if (process.env.OPENWEATHER_API_KEY != null) {
				apiParam = "&APPID=" + process.env.OPENWEATHER_API_KEY;
			} else if (this.settings.apiKey != null) {
				apiParam = "&APPID=" + this.settings.apiKey;
			}

			this.logger.info("Refreshing weather info...");

			this.result.now = await this.fetchInfo(
				`${BASE_URL}/weather?units=${unit}&lang=${lang}${apiParam}&q=${location}`
			);
			this.result.forecast = await this.fetchInfo(
				`${BASE_URL}/forecast/daily?units=${unit}&lang=${lang}${apiParam}&cnt=7&q=${location}`
			);
			this.result.today = await this.fetchInfo(
				`${BASE_URL}/forecast?units=${unit}&lang=${lang}${apiParam}&cnt=10&q=${location}`
			);

			this.result.updatedAt = Date.now();

			this.logger.info("Weather refreshed.", this.result);

			this.broker.broadcast("weather.info.updated", this.result);

			// Create "current" data
			const payload = {};
			if (this.result.now) {
				const now = this.result.now;
				payload.location = now.name;
				payload.updatedAt = now.dt;
				payload.current = {
					temperature: now.main.temp,
					pressure: now.main.pressure,
					humidity: now.main.humidity,
					wind: now.wind ? {
						speed: now.wind.speed,
						degree: now.wind.deg,
					} : undefined,
					caption: now.weather[0].main,
					description: _.capitalize(now.weather[0].description),
					icon: now.weather[0].icon,
					rain: now.rain || now.snow
				}
			}

			if (this.result.forecast) {
				const forecast = this.result.forecast;
				payload.forecast = forecast.list.map(item => {
					return {
						date: item.dt,
						temperature: {
							min: item.temp.min,
							max: item.temp.max,
						},
						humidity: item.humidity,
						pressure: item.pressure,
						wind: {
							speed: item.speed,
							degree: item.deg,
						},
						caption: item.weather[0].main,
						description: _.capitalize(item.weather[0].description),
						icon: item.weather[0].icon,
						rain: item.rain || item.snow
					}
				});
			}

			if (this.result.today) {
				const today = this.result.today;
				payload.today = today.list.map(item => {
					return {
						ts: item.dt,
						temperature: item.main.temp,
						humidity: item.main.humidity,
						pressure: item.main.pressure,
						wind: item.wind ? {
							speed: item.wind.speed,
							degree: item.wind.deg,
						} : undefined,
						caption: item.weather[0].main,
						description: _.capitalize(item.weather[0].description),
						icon: item.weather[0].icon,
						rain: item.rain || item.snow
					}
				});
			}

			this.broker.call("current.update", {
				key: "weather",
				payload
			});
		},

		async fetchInfo(url) {
			const res = await fetch(url);
			return await res.json();
		}
	},

	created() {
		this.timer = null;

		this.result = {};
	},

	async started() {
		this.timer = setInterval(
			() => this.refresh(),
			(this.settings.refreshMin || 10) * 60 * 1000
		);

		this.refresh();
	},

	async stopped() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
};
