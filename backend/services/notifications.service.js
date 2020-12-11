const _ = require("lodash");

const Moleculer = require("moleculer");

module.exports = {
	name: "notifications",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	settings: {},

	created() {
		this.store = [];
		this.expiredStore = [];
	},

	actions: {
		list: {
			params: {
				limit: "number|optional",
				offset: "number|optional",
				withExpired: "boolean|optional"
			},
			async handler(ctx) {
				let rows = [];
				if (ctx.params.withExpired) rows = [].concat(rows, this.expiredStore);
				rows = [].concat(rows, this.store);

				if (ctx.params.offset) rows = rows.slice(ctx.params.offset);
				if (ctx.params.limit) rows = rows.slice(0, ctx.params.limit);

				return rows;
			}
		},
		create: {
			params: {
				type: "string|default:message",
				severity: "string|default:info",
				title: "string",
				description: "string|optional",
				time: { type: "number", integer: true, default: 5 }
			},
			async handler(ctx) {
				return await this.addNewItem(ctx.params);
			}
		},

		confirm: {
			params: {
				id: "string"
			},
			async handler(ctx) {
				await this.removeItem(ctx.params.id);
			}
		},

		done: {
			params: {
				id: "string"
			},
			async handler(ctx) {
				await this.removeItem(ctx.params.id);
			}
		}
	},

	methods: {
		addNewItem(item) {
			item.id = Moleculer.Utils.generateToken();
			item.ts = item.ts || Date.now();

			this.store.push(item);

			this.logger.info(`New notification added. Total: ${this.store.length}`, item);

			this.broker.broadcast("notification.added", {
				item,
				total: this.store.length
			});
		},

		removeItem(id) {
			const found = this.store.findIndex(item => item.id == id);
			if (found !== -1) {
				this.logger.info(`Remove ${id} notification...`);
				const item = this.store[found];
				this.store.splice(found, 1);

				this.expiredStore.push(item);
				if (this.expiredStore.length > 100) this.expiredStore.shift();

				this.broker.broadcast("notification.removed", {
					item,
					total: this.store.length
				});
			}
		},

		/*createRandomItem(count) {
			const severities = ["error", "warning", "info", "success"];
			this.timer = setTimeout(() => {
				this.actions.create({
					severity: severities[Math.floor(Math.random() * severities.length)],
					title: `Random event #${count}`,
					description:
						"It's a random generated event. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis tempus lacinia. Nulla vestibulum lacus ut enim bibendum volutpat. Vivamus rutrum est leo, et lobortis lectus bibendum in.",
					buttons: [
						{ id: "ok", caption: "OK" },
						{ id: "cancel", caption: "Cancel", outlined: true }
					]
				});
				this.createRandomItem(++count); // recursive
			}, 5000 + Math.random() * 5000);
		},*/

		cleanStore() {
			const now = Date.now();
			const removable = this.store.filter(
				item => item.time > 0 && now - item.ts > item.time * 1000
			);
			removable.forEach(item => this.removeItem(item.id));
		}
	},

	async started() {
		this.cleanTimer = setInterval(() => this.cleanStore(), 5000);

		//this.createRandomItem(1);
	},

	stopped() {
		//if (this.timer) clearTimeout(this.timer);
		if (this.cleanTimer) clearTimeout(this.cleanTimer);
	}
};
