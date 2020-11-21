const fetch = require("node-fetch");
const Moleculer = require("moleculer");

const xml2js = require("xml2js");
const iconv = require("iconv-lite");
const htmlparser2 = require("htmlparser2");

module.exports = {
	name: "rss",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin],

	actions: {
		get: {
			params: {
				name: "string"
			},
			handler(ctx) {
				return this.result[ctx.params.name];
			}
		},

		refresh() {
			return this.refresh();
		}
	},

	methods: {
		async refresh() {
			this.logger.info("Refreshing RSS...");

			await this.Promise.all(this.settings.sources.map(async src => {
				this.result[src.name] = await this.fetchRSS(src);
			}));

			this.result.updatedAt = Date.now();

			//this.logger.info("RSS refreshed.", this.result);

			this.broker.broadcast("rss.updated", this.result);
		},

		async fetchRSS(source) {
			try {
				const res = await fetch(source.url);
				let body = await res.text();

				// Get encoding & decode the body
				const re = new RegExp(/<\?xml(?:.*) encoding="([a-zA-Z0-9-]+)"/g);
                const enc = re.exec(body);
                encoding  = (enc && (enc[1] != null)) ? enc[1] : "UTF-8";
                if (iconv.encodingExists(encoding)) {
                  this.logger.debug(`Encoding request body from ${encoding}...`);
                  body = Buffer.from(body, 'binary');
                  body = iconv.decode(body, encoding);
                }

                const json = xml2js.parseStringPromise(body, {
                  explicitArray: false
				});

				//const json = htmlparser2.parseFeed(body, {});

				return json;
			} catch(err) {
				this.logger.warn(`Unable to fetch RSS '${source.name}'.`, err, source);
			}
		}
	},

	created() {
		this.timer = null;

		this.result = {};
	},

	async started() {
		this.timer = setInterval(
			() => this.refresh(),
			(this.settings.refreshMin || 10) * 60 * 1000
		);

		this.refresh();
	},

	async stopped() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
};
