export default {
	name: "frontend",

	events: {
		"config.changed"(ctx) {
			this.logger.info("Configuration changed. Reload browser...");
			window.location.reload();
		}
	}
};
