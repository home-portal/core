import IO from "socket.io-client";

import { Transporters } from "moleculer-browser";
const BaseTransporter = Transporters.Base;

class WebsocketServerTransporter extends BaseTransporter {
	constructor(opts) {
		super(opts);

		if (!this.opts) {
			this.opts = {
				port: 4000
			};
		}

		this.socket = null;
	}

	async connect() {
		const loc = window.location;
		const port = window.location.port == 8080 ? this.opts.port : window.location.port;
		const addr = `${loc.protocol.replace("http", "ws")}//${loc.hostname}:${port}/`;
		this.logger.info(`Connecting to '${addr}'...`);
		this.socket = IO(addr);

		// Add a connect listener
		this.socket.on("connect", () => {
			this.logger.info("Websocket client connected.");
			this.onConnected();
		});

		this.socket.on("disconnect", () => {
			this.logger.info("Websocket client disconnected");
		});

		this.socket.on("reconnect", () => {
			this.logger.info("Websocket client reconnected.");
		});
	}

	async disconnect() {
		if (this.socket) {
			this.socket.close();
		}
	}

	arrayBufferToString(buffer) {
		return new TextDecoder("utf-8").decode(new Uint8Array(buffer));
	}

	/**
	 * Subscribe to a command
	 *
	 * @param {String} cmd
	 * @param {String} nodeID
	 *
	 * @memberof FakeTransporter
	 */
	async subscribe(cmd, nodeID) {
		const t = this.getTopicName(cmd, nodeID);

		if (!this.socket.hasListeners(t)) {
			this.socket.on(t, data => {
				const msg = this.arrayBufferToString(data);
				this.receive(cmd, msg);
			});
		}
	}

	/**
	 * Send data buffer.
	 *
	 * @param {String} topic
	 * @param {Buffer} data
	 * @param {Object} meta
	 *
	 * @returns {Promise}
	 */
	async send(topic, data) {
		this.socket.emit(topic, data);
	}
}

export default WebsocketServerTransporter;
