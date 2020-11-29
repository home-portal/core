const _ = require("lodash");
const { writeToTemp } = require("../utils");

module.exports = {
	name: "current",

	actions: {
		get: {
			params: {
				key: "string",
				subKey: "string|optional"
			},
			handler(ctx) {
				let res = this.current[ctx.params.key];
				if (ctx.params.subKey) res = res[ctx.params.subKey];
				return _.cloneDeep(res);
			}
		},

		update: {
			params: {
				key: "string",
				subKey: "string|optional",
				payload: "object"
			},
			async handler(ctx) {
				const key = ctx.params.key;
				const subKey = ctx.params.subKey;

				if (subKey) {
					if (!this.current[key]) this.current[key] = {};
					this.current[key][subKey] = ctx.params.payload;
				} else {
					this.current[key] = ctx.params.payload;
				}

				this.logger.info(`Current data '${key}${subKey ? "." + subKey : ""}' refreshed.`);
				this.broker.broadcast(`current.${key}.updated`, this.current[key]);

				await writeToTemp("current", this.current);
			}
		}
	},

	created() {
		this.current = {};
	}
};
