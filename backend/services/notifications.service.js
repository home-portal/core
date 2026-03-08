"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const Moleculer = require("moleculer");
const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "notifications",

	mixins: [DbMixin("notifications"), Moleculer.Mixins.ModuleConfigMixin],

	settings: {
		// Disable auto REST routes from moleculer-db to avoid autoAliases conflict
		rest: false,
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
		// Disable moleculer-db default REST actions (use /api/notifications route instead)
		find: { rest: false },
		get: { rest: false },
		update: { rest: false },
		remove: { rest: false },

		list: {
			rest: false,
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
				if (ctx.params.limit !== undefined) params.limit = ctx.params.limit;
				// Fix #4: 0 is a valid offset, use !== undefined instead of falsy check
				if (ctx.params.offset !== undefined) params.offset = ctx.params.offset;

				return await this.adapter.find(params);
			}
		},

		create: {
			rest: false,
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
			// Fix #6: store timestamps as Unix ms numbers, not Date objects
			const now = Date.now();
			const persistent = params.persistent === true;

			let expiresAt = null;
			if (!persistent && params.time > 0) {
				expiresAt = now + params.time * 1000;
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
			// Fix #2: use findById instead of find with _id query
			const item = await this.adapter.findById(id);

			// Fix #3: throw proper Moleculer error instead of silent null return
			if (!item) {
				throw new MoleculerClientError("Notification not found", 404, "NOT_FOUND", { id });
			}

			// Fix #6: store confirmedAt as Unix ms timestamp
			const updated = await this.adapter.updateById(id, {
				$set: { confirmed: true, confirmedAt: Date.now() }
			});

			const count = await this.adapter.count({ query: { confirmed: false } });

			// Fix #5: broadcast notification.confirmed for user confirm actions
			this.broker.broadcast("notification.confirmed", {
				item: updated,
				total: count
			});

			return updated;
		},

		async cleanExpired() {
			// Fix #6: compare number timestamps (no Date objects in DB)
			const now = Date.now();

			const expired = await this.adapter.find({
				query: {
					persistent: false,
					confirmed: false,
					expiresAt: { $ne: null, $lte: now }
				}
			});

			for (const item of expired) {
				await this.adapter.removeById(item._id);
				this.logger.debug(`Auto-removed expired notification: ${item._id}`);
			}

			// Fix #1: single count query after the loop, not inside it
			if (expired.length > 0) {
				const count = await this.adapter.count({ query: { confirmed: false } });

				for (const item of expired) {
					this.broker.broadcast("notification.removed", {
						item,
						total: count
					});
				}

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
