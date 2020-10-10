const express = require("express");

module.exports = {
	name: "www",

	started() {
		this.server = express();

		this.server.use("/media", express.static("./data/media"));
		this.server.use(express.static("./frontend/public"));

		const port = 3000;
		this.server.listen(port, () => {
			this.logger.info(`WWW service listening at http://localhost:${port}`);
		});
	},

	stopped() {
		this.server.close();
	}
};
