"use strict";

const exec = require("child_process").exec;
const execa = require("execa");

const DEV = process.env.NODE_ENV !== "production";
module.exports = {
	name: "os",

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
				await this.broker.stop();
				process.exit(0);
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
			handler() {
				if (DEV) return Math.random() * 100;

				// TODO:
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
		}
	}
};
