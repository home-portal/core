const yaml = require("js-yaml");
const fs = require("fs");
const _ = require("lodash");
const { makeDirs } = require("moleculer").Utils;

module.exports = {
	name: "config",

	settings: {
		filename: "./configuration.yaml"
	},

	actions: {
		get: {
			async handler() {
				return _.cloneDeep(this.config);
			}
		}
	},

	methods: {
		/**
		 * Load configuration file
		 */
		load() {
			this.logger.debug("Loading configuration...", { filename: this.settings.filename });
			try {
				const config = yaml.safeLoad(fs.readFileSync(this.settings.filename, "utf8"));

				this.config = _.defaultsDeep(config, {});
				this.logger.info("Configuration loaded.", this.config);
			} catch (err) {
				this.logger.fatal("Unable to load configuration.yaml", err);
			}

			// Create data folder if not exist
			if (this.config.dataFolder && !fs.existsSync(this.config.dataFolder)) {
				this.logger.debug("Create data folder...", { folder: this.config.dataFolder });
				makeDirs(this.config.dataFolder);
			}
		},

		/**
		 * Save configuration file
		 */
		save() {
			this.logger.debug("Saving configuration...", { filename: this.settings.filename });
			try {
				fs.writeFileSync(this.settings.filename, yaml.safeDump(this.config || {}), "utf8");
				this.logger.info("Configuration saved.");
			} catch (err) {
				this.logger.error("Unable to save configuration.yaml", err);
			}
		}
	},

	created() {
		this.config = null;
	},

	async started() {
		await this.load();
	},

	stopped() {}
};
