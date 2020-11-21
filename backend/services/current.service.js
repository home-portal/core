const _ = require("lodash");
const { writeToTemp } = require("../utils");

module.exports = {
	name: "current",

	actions: {
		get: {
			params: {
				key: "string"
			},
			handler(ctx) {
				return _.cloneDeep(this.current[ctx.params.key]);
			}
		},

		update: {
			params: {
				key: "string",
				payload: "object"
			},
			async handler(ctx) {
				const key = ctx.params.key;
				this.current[key] = ctx.params.payload;

				this.logger.info(`Current data '${key}' refreshed.`);
				this.broker.broadcast(`current.${key}.updated`, this.current[key]);

				await writeToTemp("current", this.current);
			}
		}
	},

	created() {
		this.current = {};
	}
};
