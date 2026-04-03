import { ServiceBroker } from "moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";
import uid from "uid";

function isLocal() {
	const hostname = window.location.hostname;
	return hostname == "localhost" || hostname == "127.0.0.1";
}

/**
 * Create ServiceBroker instance.
 */
function createBroker() {
	const broker = new ServiceBroker({
		nodeID: "frontend-" + uid(8),
		transporter: new WebsocketClientTransporter(),
		metadata: {
			local: isLocal()
		},
		metrics: {
			enabled: false,
			reporter: "Console"
		},
		tracing: {
			enabled: false,
			exporter: "Console"
		}
	});

	// Override getCpuUsage — the default uses Node.js os.cpus() which
	// is not available in the browser and crashes the heartbeat timer.
	broker.getCpuUsage = () => Promise.resolve({ avg: 0 });

	return broker;
}

/**
 * Load all services from the "services" folder.
 * @param {ServiceBroker} broker
 */
function loadAllServices(broker) {
	const modules = import.meta.glob('./services/**/*.service.js', { eager: true });
	Object.values(modules).forEach(mod => {
		broker.createService(mod.default);
	});
}

/**
 * Create an event linker service which listens the Moleculer events
 * and calls the handlers in Vue components.
 *
 * @param {ServiceBroker} broker
 */
function createEventLinkerService(broker) {
	const eventListeners = {};
	let service;
	let reloadTimer = null;
	let reloading = false;
	let pendingReload = false;

	const addListeners = function () {
		let changed = false;
		if (this.$options.events) {
			const conf = this.$options.events;
			Object.keys(conf).forEach(key => {
				let func = conf[key].bind(this);
				if (!eventListeners[key]) eventListeners[key] = [];

				broker.logger.debug(`Add event listener for '${key}'`);
				eventListeners[key].push(func);
				conf[key].__binded = func;
				changed = true;
			});
		}
		if (changed) scheduleReload();
	};

	const removeListeners = function () {
		let changed = false;
		if (this.$options.events) {
			const conf = this.$options.events;
			Object.keys(conf).forEach(key => {
				if (eventListeners[key]) {
					broker.logger.debug(`Remove event listener for '${key}'`);
					eventListeners[key] = eventListeners[key].filter(
						fn => fn != conf[key].__binded
					);
					changed = true;
				}
			});
		}
		if (changed) scheduleReload();
	};

	const scheduleReload = () => {
		if (reloadTimer) clearTimeout(reloadTimer);
		reloadTimer = setTimeout(() => {
			reloadTimer = null;
			reloadService();
		}, 50);
	};

	const reloadService = async () => {
		if (reloading) {
			pendingReload = true;
			return;
		}
		reloading = true;

		try {
			const svc = broker.getLocalService("$event-linker");
			if (svc) {
				await broker.destroyService(svc);
			}

			const schema = {
				name: "$event-linker",
				events: {}
			};

			Object.entries(eventListeners).forEach(([key, fnList]) => {
				if (fnList.length === 0) return;
				schema.events[key] = {
					context: true,
					handler(ctx) {
						fnList.forEach(fn => fn.call(null, ctx));
					}
				};
			});

			service = broker.createService(schema);
		} finally {
			reloading = false;
		}

		if (pendingReload) {
			pendingReload = false;
			await reloadService();
		}
	};

	return {
		addListeners,
		removeListeners,
		reloadService,
		service
	};
}

export default {
	install(app) {
		// Create broker
		const broker = createBroker();

		app.config.globalProperties.broker = broker;
		window.broker = broker;

		window.addEventListener("unload", () => broker.stop());

		// Load all services from the services directory
		loadAllServices(broker);

		// --- EVENT LINKER SERVICE ---
		const linker = createEventLinkerService(broker);

		// Register custom option merge strategy to suppress Vue 3 warnings
		app.config.optionMergeStrategies.events = (parent, child) => {
			return child ? { ...parent, ...child } : parent;
		};

		app.mixin({
			created: linker.addListeners,
			beforeUnmount: linker.removeListeners
		});
	},

	get broker() {
		return window.broker;
	}
};
