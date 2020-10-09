"use strict";

const { inspect } = require("util");
const WebsocketServerTransporter = require("./backend/WebsocketServerTransporter");
require("./backend/mixins/settings.mixin");

module.exports = {
	nodeID: "backend",

	logger: {
		type: "Console",
		options: {
			objectPrinter: o => inspect(o, { depth: 4, colors: true, breakLength: 50 })
		}
	},

	logLevel: "info",

	transporter: new WebsocketServerTransporter(),

	middlewares: []
};
