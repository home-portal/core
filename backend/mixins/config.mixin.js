const Moleculer = require("moleculer");

const ModuleConfigMixin = {
	dependencies: ["config"],

	events: {
		async "config.changed"() {
			this.config = await this.broker.call("config.get");
			this.logger.debug("Config updated", this.config);
		}
	},

	created() {
		this.config = {};
	},

	async started() {
		this.config = await this.broker.call("config.get");
		this.logger.debug("Configuration:", this.config);
	}
};

if (!Moleculer.Mixins) Moleculer.Mixins = {};

Moleculer.Mixins.ModuleConfigMixin = ModuleConfigMixin;
