"use strict";

const os = require("os");
const exec = require("child_process").exec;
const Moleculer = require("moleculer");
//const execa = require("execa");

const DEV = process.env.NODE_ENV !== "production";
const PLATFORM = os.platform();
module.exports = {
	name: "os",
	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	actions: {
		powerOff: {
			handler() {
				if (DEV) return this.logger.info("Power off disabled in dev mode.");

				this.logger.warn("Shutdown the device...");
				return this.executeCommand("sudo poweroff");
			}
		},

		reboot: {
			handler() {
				if (DEV) return this.logger.info("Reboot disabled in dev mode.");

				this.logger.warn("Rebooting the device...");
				return this.executeCommand("sudo reboot");
			}
		},

		exit: {
			async handler() {
				this.logger.info("Exiting from application...");
				await this.executeCommand("pkill -o chromium");
				//await this.broker.stop();
				//process.exit(0);
			}
		},

		displayOff: {
			async handler() {
				if (DEV) return this.logger.info("Display OFF disabled in dev mode.");

				this.logger.info("Turning off the display...");
				await this.executeCommand(
					"XAUTHORITY=/home/pi/.Xauthority xset -display :0.0 dpms force off"
				);
			}
		},

		displayOn: {
			async handler() {
				if (DEV) return this.logger.info("Display ON disabled in dev mode.");

				this.logger.info("Turning on the display...");
				await this.executeCommand(
					"XAUTHORITY=/home/pi/.Xauthority xset -display :0.0 dpms force on"
				);
				await this.executeCommand(
					"XAUTHORITY=/home/pi/.Xauthority xset -display :0.0 s off"
				);
				await this.executeCommand(
					"XAUTHORITY=/home/pi/.Xauthority xset -display :0.0 -dpms"
				);
				await this.executeCommand(
					"XAUTHORITY=/home/pi/.Xauthority xset -display :0.0 s noblank"
				);
			}
		},

		cpuTemperature: {
			async handler() {
				if (DEV) return Math.random() * 100;
				if (PLATFORM != "linux")
					return this.logger.info("CPU temperature query works only on Linux.");

				const rsp = await this.executeCommand(
					"/opt/vc/bin/vcgencmd measure_temp | cut -d= -f2 | awk '{print $1}'"
				);
				const p = rsp.split("'");
				if (p[0]) return Number(p[0]);

				return null;
			}
		},

		getTimeZone: {
			async handler() {
				return Intl.DateTimeFormat().resolvedOptions().timeZone;
				/*if (DEV) return this.logger.info("Timezone query disabled in dev mode.");
				if (PLATFORM != "linux")
					return this.logger.info("Timezone query works only on Linux.");

				const rsp = await this.executeCommand(
					'timedatectl show -p Timezone | cut -f2 -d"="'
				);
				if (rsp) return rsp.trim();
				*/
			}
		},

		setTimeZone: {
			params: {
				timeZone: "string"
			},
			async handler(ctx) {
				if (DEV) return this.logger.info("Timezone setting disabled in dev mode.");
				if (PLATFORM != "linux")
					return this.logger.info("Timezone setting works only on Linux.");

				await this.setTimeZone(`timedatectl set-timezone ${ctx.params.timeZone}`);
			}
		}
	},

	methods: {
		/**
		 * Execute a shell command.
		 * TODO: using execa
		 *
		 * @param {String} cmd
		 */
		executeCommand(cmd) {
			return new Promise((resolve, reject) => {
				this.logger.info("Exeucte command:", cmd);
				exec(cmd, (error, stdout, stderr) => {
					if (error != null) {
						this.logger.error(error, stderr);
						return reject(error);
					}

					this.logger.debug(stdout);
					return resolve(stdout);
				});
			});
		},

		async setTimeZone(timeZone) {
			await this.executeCommand(`timedatectl set-timezone ${timeZone}`);
			this.logger.info(`Time zone has been changed to '${timeZone}'.`);
		}
	},

	async started() {
		if (!DEV && PLATFORM == "linux") {
			// Check timezone setting.
			try {
				const currTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				const wantedTimeZone = this.config.timeZone || currTimeZone;
				this.logger.debug(`Time zones: ${currTimeZone} -> ${wantedTimeZone}`);

				if (currTimeZone.trim().toLowerCase() != wantedTimeZone.trim().toLowerCase()) {
					this.logger.info(
						`Changing time zone from '${currTimeZone}' to '${wantedTimeZone}'...`
					);
					await this.setTimeZone(wantedTimeZone);
				}
			} catch (err) {
				this.logger.error("Unable to change time zone.", err);
			}
		}
	}
};
