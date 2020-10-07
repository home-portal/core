module.exports = {
	name: "weather",

	dependencies: ["modules"],

	created() {
		this.settings = {};
	},

	async started() {
		this.settings = await this.broker.call("modules.settings", { name: "weather" });

		this.logger.info("Weather settings", this.settings);
	}
};
