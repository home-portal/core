"use strict";

const Moleculer = require("moleculer");
const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "notifications",

	mixins: [DbMixin("notifications"), Moleculer.Mixins.ModuleConfigMixin],

	settings: {
		fields: [
			"_id",
			"type",
			"severity",
			"title",
			"description",
			"time",
			"persistent",
			"source",
			"confirmed",
			"confirmedAt",
			"createdAt",
			"expiresAt"
		]
	},

	actions: {
		list: {
			params: {
				limit: "number|optional",
				offset: "number|optional",
				confirmed: "boolean|optional"
			},
			async handler(ctx) {
				const confirmedFilter =
					ctx.params.confirmed !== undefined ? ctx.params.confirmed : false;

				const params = {
					query: { confirmed: confirmedFilter }
				};
				if (ctx.params.limit) params.limit = ctx.params.limit;
				if (ctx.params.offset) params.offset = ctx.params.offset;

				return await this.adapter.find(params);
			}
		},

		create: {
			params: {
				type: "string|default:message",
				severity: "string|default:info",
				title: "string",
				description: "string|optional",
				time: { type: "number", integer: true, default: 5 },
				persistent: "boolean|optional",
				source: "string|optional"
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
				return await this.confirmItem(ctx.params.id);
			}
		},

		done: {
			params: {
				id: "string"
			},
			async handler(ctx) {
				return await this.confirmItem(ctx.params.id);
			}
		}
	},

	methods: {
		async addNewItem(params) {
			const now = new Date();
			const persistent = params.persistent === true;

			let expiresAt = null;
			if (!persistent && params.time > 0) {
				expiresAt = new Date(now.getTime() + params.time * 1000);
			}

			const entity = {
				type: params.type || "message",
				severity: params.severity || "info",
				title: params.title,
				description: params.description || null,
				time: params.time !== undefined ? params.time : 5,
				persistent,
				source: params.source || null,
				confirmed: false,
				confirmedAt: null,
				createdAt: now,
				expiresAt
			};

			const doc = await this.adapter.insert(entity);

			const count = await this.adapter.count({ query: { confirmed: false } });

			this.logger.info(`New notification added. Total: ${count}`, doc);

			this.broker.broadcast("notification.added", {
				item: doc,
				total: count
			});

			return doc;
		},

		async confirmItem(id) {
			const now = new Date();

			const items = await this.adapter.find({ query: { _id: id } });
			if (!items || items.length === 0) {
				this.logger.warn(`Notification ${id} not found`);
				return null;
			}

			const updated = await this.adapter.updateById(id, {
				$set: { confirmed: true, confirmedAt: now }
			});

			const count = await this.adapter.count({ query: { confirmed: false } });

			this.broker.broadcast("notification.removed", {
				item: updated,
				total: count
			});

			return updated;
		},

		async cleanExpired() {
			const now = new Date();

			// Find non-persistent, unconfirmed notifications that have expired
			const expired = await this.adapter.find({
				query: {
					persistent: false,
					confirmed: false,
					expiresAt: { $ne: null, $lte: now }
				}
			});

			for (const item of expired) {
				await this.adapter.removeById(item._id);

				const count = await this.adapter.count({ query: { confirmed: false } });

				this.broker.broadcast("notification.removed", {
					item,
					total: count
				});

				this.logger.debug(`Auto-removed expired notification: ${item._id}`);
			}

			if (expired.length > 0) {
				this.logger.info(`Cleaned ${expired.length} expired notification(s)`);
			}
		}
	},

	async started() {
		this.cleanTimer = setInterval(() => this.cleanExpired(), 5000);
	},

	stopped() {
		if (this.cleanTimer) clearInterval(this.cleanTimer);
	}
};
