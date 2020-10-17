const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const globby = require("globby");

const Moleculer = require("moleculer");
const { makeDirs } = Moleculer.Utils;
const { MoleculerClientError } = Moleculer.Errors;

module.exports = {
	name: "modules",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	settings: {
		folder: "./modules"
	},

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
			const enabledModules = Object.keys(this.config.modules) || [];
			this.logger.info("Loading modules...", { enabledModules });

			for (const moduleName of enabledModules) {
				try {
					await this.loadModule(moduleName);
				} catch (err) {
					this.logger.fatal(`Unable to load module '${moduleName}'`, err);
				}
			}
			this.logger.debug("Loaded modules", this.modules);
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
					this.logger.debug("Module configuration loaded.", entry.config);
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

			// Load backend services
			const serviceFiles = await globby("**.service.js", { cwd: folder });
			serviceFiles.map(f => this.broker.loadService(path.join(folder, f)));
		}
	},

	events: {
		async "$broker.started"() {
			await this.loadModules();
		}
	},

	created() {
		this.modules = {};

		// Create modules folder if not exist
		if (this.settings.folder && !fs.existsSync(this.settings.folder)) {
			this.logger.debug("Create modules folder...", { folder: this.settings.folder });
			makeDirs(this.settings.folder);
		}
	}
};
