const Datastore = require("nedb");
const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const _ = require("lodash");

const Moleculer = require("moleculer");
const { makeDirs } = Moleculer.Utils;

module.exports = {
	name: "db",

	mixins: [Moleculer.Mixins.ModuleConfigMixin],

	settings: {},

	actions: {
		list: {
			params: {
				collection: "string",
				limit: "number|optional",
				offset: "number|optional",
				sort: "string",
				query: "object"
			},
			async handler(ctx) {
				const db = this.getCollection(ctx.params.collection);
				return new this.Promise((resolve, reject) => {
					this.createQuery(db, ctx.params).exec((err, docs) => {
						if (err) return reject(err);
						resolve(docs);
					});
				});
			}
		},
		create: {
			params: {
				collection: "string",
				entity: "object"
			},
			async handler(ctx) {
				const db = this.getCollection(ctx.params.collection);
				return new this.Promise((resolve, reject) => {
					db.insert(ctx.params.entity, (err, doc) => {
						if (err) return reject(err);
						resolve(doc);
					});
				});
			}
		},
		update: {
			params: {
				collection: "string",
				entity: "object"
			},
			async handler(ctx) {
				const db = this.getCollection(ctx.params.collection);
				const _id = ctx.params.entity.id;
				return new this.Promise((resolve, reject) => {
					db.update(
						{ _id },
						ctx.params,
						{ returnUpdatedDocs: true },
						(err, numAffected, affectedDocuments) => {
							if (err) return reject(err);
							resolve(affectedDocuments);
						}
					);
				});
			}
		},
		remove: {
			params: {
				collection: "string",
				id: "string"
			},
			async handler(ctx) {
				const db = this.getCollection(ctx.params.collection);
				return new this.Promise((resolve, reject) => {
					db.remove({ _id: ctx.params.id }, err => {
						if (err) return reject(err);
						resolve(ctx.params.id);
					});
				});
			}
		},
		clean: {
			params: {
				collection: "string"
			},
			async handler(ctx) {
				const db = this.getCollection(ctx.params.collection);
				return new this.Promise((resolve, reject) => {
					db.remove({}, { multi: true }, (err, numRemoved) => {
						if (err) return reject(err);
						resolve(numRemoved);
					});
				});
			}
		}
	},

	methods: {
		async getCollection(name) {
			if (!this.stores[name]) {
				const db = new Datastore(this.opts);
				await new this.Promise((resolve, reject) => {
					db.loadDatabase(err => {
						if (err) return reject(err);
						resolve();
					});
				});

				this.stores[name] = db;
			}

			return this.stores[name];
		},

		createQuery(db, params) {
			let q;

			// Text search
			let query = params.query || {};

			if (_.isString(params.search) && params.search !== "") {
				query.$where = function () {
					let doc = this;
					const s = params.search.toLowerCase();
					if (params.searchFields) doc = _.pick(this, params.searchFields);

					const res = _.values(doc).find(v => String(v).toLowerCase().indexOf(s) !== -1);
					return res != null;
				};
			}
			q = db.find(query);

			// Sort
			if (params.sort) {
				if (typeof params.sort == "string") params.sort = [params.sort];
				const sortFields = {};
				params.sort.forEach(field => {
					if (field.startsWith("-")) sortFields[field.slice(1)] = -1;
					else sortFields[field] = 1;
				});
				q.sort(sortFields);
			}

			// Limit
			if (_.isNumber(params.limit) && params.limit > 0) q.limit(params.limit);

			// Offset
			if (_.isNumber(params.offset) && params.offset > 0) q.skip(params.offset);

			return q;
		}
	},

	async started() {
		this.stores = {};

		// Create db folder
		const folder = path.join(this.config.dataFolder, this.config.dbFolder);
		if (!existsSync(folder)) {
			this.logger.debug("Create DB folder...", { folder: folder });
			makeDirs(folder);
		}
	},

	stopped() {}
};
