const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { makeDirs } = require("moleculer").Utils;
const globby = require("globby");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	name: "modules",

	settings: {
		folder: "./modules"
	},

	dependencies: ["config"],

	actions: {
		all: {
			async handler() {
				return _.cloneDeep(this.modules);
			}
		},

		settings: {
			params: {
				name: "string"
			},
			async handler(ctx) {
				const module = await this.modules[ctx.params.name];
				if (!module) {
					throw new MoleculerClientError("Module not found", 404, "MODULE_NOT_FOUND", {
						name: ctx.params.name
					});
				}

				return module.settings;
			}
		}
	},

	methods: {
		/**
		 * Load all modules
		 */
		async loadModules() {
			this.logger.debug("Finding modules...", { folder: this.settings.folder });
			try {
				const dirs = await globby("*", {
					// https://github.com/mrmlnc/fast-glob#options-3
					cwd: "./modules",
					deep: 1,
					onlyDirectories: true
				});
				this.logger.info("Found module directories:", dirs);

				await Promise.all(dirs.map(dir => this.loadModule(dir)));
				this.logger.info("Loaded modules", this.modules);
			} catch (err) {
				this.logger.fatal("Unable to load modules", err);
			}
		},

		/**
		 * Load a module
		 * @param {String} name
		 */
		async loadModule(name) {
			const folder = path.join("./", this.settings.folder, name);
			if (!fs.existsSync(folder)) {
				this.logger.warn("Module folder is not found", { folder });
				return;
			}

			const moduleConfFile = path.join(folder, "module.yaml");
			let entry = { name, folder, config: {} };
			if (fs.existsSync(moduleConfFile)) {
				try {
					entry.config = yaml.safeLoad(fs.readFileSync(moduleConfFile, "utf8"));
					this.logger.info("Module configuration loaded.", entry.config);
				} catch (err) {
					this.logger.fatal(`Unable to load '${moduleConfFile}'`, err);
				}
			}

			entry.settings = _.defaultsDeep(
				{},
				this.config.modules[name],
				entry.config.defaultSettings
			);

			this.modules[entry.name] = entry;
		}
	},

	created() {
		this.modules = {};
		this.config = {};

		// Create modules folder if not exist
		if (this.settings.folder && !fs.existsSync(this.settings.folder)) {
			this.logger.debug("Create modules folder...", { folder: this.settings.folder });
			makeDirs(this.settings.folder);
		}
	},

	async started() {
		this.config = await this.broker.call("config.get");
		await this.loadModules();
	},

	stopped() {}
};
