const Moleculer = require("moleculer");

const ModuleSettingsMixin = {
	dependencies: ["modules"],

	events: {
		async "config.changed"() {
			this.settings = await this.broker.call("modules.settings", { name: this.name });
			this.logger.info(`Settings updated for '${this.name}'`, this.settings);
		}
	},

	created() {
		this.settings = {};
	},

	async started() {
		this.settings = await this.broker.call("modules.settings", { name: this.name });
		this.logger.info(`Settings for '${this.name}'`, this.settings);
	}
};

if (!Moleculer.Mixins) Moleculer.Mixins = {};

Moleculer.Mixins.ModuleSettingsMixin = ModuleSettingsMixin;
