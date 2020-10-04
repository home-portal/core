"use strict";

const WebsocketServerTransporter = require("./backend/WebsocketServerTransporter");

module.exports = {
	nodeID: "backend",

	logger: "Console",
	logLevel: "info",

	transporter: new WebsocketServerTransporter(),

	middlewares: []
};
