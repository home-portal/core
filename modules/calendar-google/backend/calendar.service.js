const fetch = require("node-fetch");
const Moleculer = require("moleculer");

const BASE_URL = "http://api.openweathermap.org/data/2.5";

module.exports = {
	name: "calendar-google",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin],

	settings: {
		tokenFile: "",
		secretFile: ""
	},

	actions: {
		get() {
			return this.result;
		},

		refresh() {
			return this.refresh();
		}
	},

	methods: {
		async refresh() {
			/*const lang = this.settings.language || "en";
			const unit = this.settings.unit || "metric";
			const location = encodeURIComponent(this.settings.location || "London");
			let apiParam = "";
			if (this.settings.apiKey != null) {
				apiParam = "&APPID=" + this.settings.apiKey;
			}

			this.logger.info("Refreshing weather info...");

			this.result.now = await this.fetchJson(
				`${BASE_URL}/weather?units=${unit}&lang=${lang}${apiParam}&q=${location}`
			);
			this.result.forecast = await this.fetchJson(
				`${BASE_URL}/forecast/daily?units=${unit}&lang=${lang}${apiParam}&cnt=7&q=${location}`
			);
			this.result.today = await this.fetchJson(
				`${BASE_URL}/forecast?units=${unit}&lang=${lang}${apiParam}&cnt=10&q=${location}`
			);

			this.result.updatedAt = Date.now();

			this.logger.debug("Weather refreshed.", this.result);

			this.broker.broadcast("weather.info.updated", this.result);
			*/
		},

		async fetchJson(url, opts) {
			const res = await fetch(url, otps);
			return await res.json();
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
