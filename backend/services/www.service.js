const express = require("express");
const cors = require("cors");

const Moleculer = require("moleculer");

module.exports = {
	name: "www",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	started() {
		this.server = this.broker.options.server;
		const app = this.broker.options.app;

		app.use(
			cors({
				origin: true,
				credentials: true
			})
		);

		app.use("/media", express.static("./data/media"));
		app.use(express.static("./public"));

		const port = process.env.PORT || this.config.httpPort;
		this.server.listen(port, () => {
			this.logger.info(`WWW + WS server listening at http://localhost:${port}`);
		});
	},

	stopped() {
		this.server.close();
	}
};
