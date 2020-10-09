const yaml = require("js-yaml");
const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const _ = require("lodash");
const { makeDirs } = require("moleculer").Utils;

module.exports = {
	name: "config",

	settings: {
		filename: "./configuration.yaml",
		templateFilename: path.join(__dirname, "..", "configuration.template.yaml")
	},

	actions: {
		get: {
			async handler() {
				return _.cloneDeep(this.config);
			}
		},

		reload: {
			async handler() {
				await this.load();
				return _.cloneDeep(this.config);
			}
		},

		getModule: {
			params: {
				name: "string"
			},

			async handler(ctx) {
				const defaultSettings = await this.getModuleDefaultSettings(ctx.params.name);

				const settings = this.config.modules[ctx.params.name];

				return _.defaultsDeep({}, settings, defaultSettings);
			}
		}
	},

	methods: {
		/**
		 * Load configuration file
		 */
		async load() {
			if (!existsSync(this.settings.filename)) {
				this.logger.warn("Creating default configuration file...", {
					filename: this.settings.filename
				});
				const content = await fs.readFile(this.settings.templateFilename, "utf8");
				await fs.writeFile(this.settings.filename, content, "utf8");
			}

			this.logger.debug("Loading configuration...", { filename: this.settings.filename });
			try {
				const config = yaml.safeLoad(await fs.readFile(this.settings.filename, "utf8"));

				this.config = _.defaultsDeep(config, {});
				this.logger.info("Configuration loaded.", this.config);
			} catch (err) {
				this.logger.fatal("Unable to load configuration.yaml", err);
			}

			// Create data folder if not exist
			if (this.config.dataFolder && !existsSync(this.config.dataFolder)) {
				this.logger.debug("Create data folder...", { folder: this.config.dataFolder });
				makeDirs(this.config.dataFolder);
			}
		},

		/**
		 * Save configuration file
		 */
		async save() {
			this.logger.debug("Saving configuration...", { filename: this.settings.filename });
			try {
				await fs.writeFile(
					this.settings.filename,
					yaml.safeDump(this.config || {}),
					"utf8"
				);
				this.logger.info("Configuration saved.");
			} catch (err) {
				this.logger.error("Unable to save configuration.yaml", err);
			}
		},

		async getModuleDefaultSettings(name) {
			const filename = path.join("modules", name, "module.yaml");
			try {
				if (!existsSync(filename)) return null;

				const moduleData = yaml.safeLoad(await fs.readFile(filename, "utf8"));
				return moduleData.defaultSettings;
			} catch (err) {
				this.logger.error("Unable to read module config file", filename, err);
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
