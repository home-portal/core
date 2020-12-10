const _ = require("lodash");

const Moleculer = require("moleculer");

module.exports = {
	name: "notifications",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	settings: {},

	created() {
		this.store = [];
	},

	actions: {
		list: {
			params: {
				limit: "number|optional",
				offset: "number|optional"
			},
			async handler(ctx) {
				let rows = Array.from(this.store);
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
				message: "string|optional",
				time: { type: "number", integer: true, default: 5 }
			},
			async handler(ctx) {
				return await this.addNewItem(ctx, ctx.params);
			}
		},

		confirm: {
			params: {
				id: "string"
			},
			async handler(ctx) {
				await this.removeItem(ctx, ctx.params.id);
			}
		},

		done: {
			params: {
				id: "string"
			},
			async handler(ctx) {
				await this.removeItem(ctx, ctx.params.id);
			}
		}
	},

	methods: {
		addNewItem(ctx, item) {
			item.id = Moleculer.Utils.generateToken();
			item.ts = item.ts || Date.now();

			this.store.push(item);

			this.logger.info(`New notification added. Total: ${this.store.length}`, item);

			ctx.broadcast("notifications.changed", {
				item,
				total: this.store.length
			});
		},

		removeItem(id) {
			const found = this.store.findIndex(item => item.id == id);
			if (found !== -1) {
				this.logger.info(`Remove ${id} notification...`);
				this.store.splice(found, 1);
			}
		},

		createRandomItem(count) {
			this.timer = setTimeout(() => {
				this.actions.create({
					title: `Random event #${count}`,
					message: "It's a random generated event"
				});
				this.createRandomItem(++count); // recursive
			}, 5000 + Math.random() * 5000);
		},

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

		this.createRandomItem(1);
	},

	stopped() {
		if (this.timer) clearTimeout(this.timer);
		if (this.cleanTimer) clearTimeout(this.cleanTimer);
	}
};
