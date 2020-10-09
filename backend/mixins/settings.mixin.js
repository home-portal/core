const Moleculer = require("moleculer");

const ModuleSettingsMixin = {
	dependencies: ["modules"],

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
