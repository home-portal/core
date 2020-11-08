const Moleculer = require("moleculer");
const ApiGateway = require("moleculer-web");

const PortUpdater = {
	started() {
		this.settings.port = process.env.PORT || this.config.httpPort;
	}
};

module.exports = {
	name: "www",

	mixins: [ApiGateway, PortUpdater, Moleculer.Mixins.ModuleConfigMixin],

	settings: {
		cors: {
			origin: true,
			credentials: true
		},

		routes: [
			{
				path: "/api",
				autoAliases: true
			},

			{
				path: "/media",
				use: [ApiGateway.serveStatic("./data/media")],
				mappingPolicy: "restrict"
			}
		],

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	created() {
		// Add pointer for WebsocketTransporter that it can also use it.
		this.broker.transit.tx.opts.server = this.server;
	},

	started() {
		/*const port = process.env.PORT || this.config.httpPort;
			this.server.listen(port, () => {
				this.logger.info(`WWW + WS server listening at http://localhost:${port}`);
			});*/
	},

	stopped() {
		this.server.close();
	}
};
