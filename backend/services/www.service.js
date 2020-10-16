const express = require("express");
const Moleculer = require("moleculer");

module.exports = {
	name: "www",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	started() {
		this.server = express();

		this.server.use("/media", express.static("./data/media"));
		this.server.use(express.static("./public"));

		const port = process.env.PORT || this.config.httpPort;
		this.server.listen(port, () => {
			this.logger.info(`WWW service listening at http://localhost:${port}`);
		});
	},

	stopped() {
		this.server.close();
	}
};
