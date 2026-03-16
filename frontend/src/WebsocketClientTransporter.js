import { io } from "socket.io-client";

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
		this.wasConnected = false;
		this.disconnectTimer = null;
	}

	showDisconnectedOverlay() {
		if (document.getElementById("ws-disconnected-overlay")) return;

		const overlay = document.createElement("div");
		overlay.id = "ws-disconnected-overlay";
		overlay.innerHTML = `
			<div class="ws-disconnected-icon"><i class="fas fa-unlink"></i></div>
			<div class="ws-disconnected-text">Kapcsolat megszakadt</div>
			<div class="ws-disconnected-sub">Újracsatlakozás...</div>
		`;
		document.body.appendChild(overlay);
	}

	removeDisconnectedOverlay() {
		const overlay = document.getElementById("ws-disconnected-overlay");
		if (overlay) overlay.remove();
	}

	async connect() {
		const loc = window.location;
		const port = loc.port == 8080 ? this.opts.port : loc.port;
		const addr = `${loc.protocol}//${loc.hostname}:${port}/`;

		this.logger.info(`Connecting to '${addr}'...`);
		this.socket = io(addr);

		// Add a connect listener
		this.socket.on("connect", () => {
			this.logger.info("Websocket client connected.");
			this.wasConnected = true;
			if (this.disconnectTimer) {
				clearTimeout(this.disconnectTimer);
				this.disconnectTimer = null;
			}
			this.removeDisconnectedOverlay();
			this.onConnected();
		});

		this.socket.on("disconnect", () => {
			this.logger.info("Websocket client disconnected");
			if (this.wasConnected) {
				// Show overlay after 5 seconds (ignore brief blips)
				this.disconnectTimer = setTimeout(() => {
					this.showDisconnectedOverlay();
				}, 5000);
			}
		});

		this.socket.io.on("reconnect", () => {
			this.logger.info("Websocket client reconnected. Reloading page...");
			window.location.reload();
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
