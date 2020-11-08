const _ = require("lodash");

//const Moleculer = require("moleculer");
//const { MoleculerClientError } = Moleculer.Errors;

module.exports = {
	name: "current",

	//mixins: [Moleculer.Mixins.ModuleConfigMixin],

	actions: {
		get: {
			handler(ctx) {
				return _.cloneDeep(this.current);
			}
		},

		update: {
			params: {
				key: "string",
				payload: "object"
			},
			handler(ctx) {
				this.current[ctx.params.key] = ctx.params.payload;

				this.logger.info(
					`Current data '${ctx.params.key}' refreshed.`,
					this.current[ctx.params.key]
				);

				this.broker.broadcast("current.data.updated", this.current);
			}
		}
	},

	created() {
		this.current = {};
	}
};
