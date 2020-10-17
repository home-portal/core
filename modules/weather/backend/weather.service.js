const fetch = require("node-fetch");
const Moleculer = require("moleculer");

const BASE_URL = "http://api.openweathermap.org/data/2.5";

module.exports = {
	name: "weather",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin],

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
			const lang = this.settings.language || "en";
			const unit = this.settings.unit || "metric";
			const location = encodeURIComponent(this.settings.location || "London");
			let apiParam = "";
			if (process.env.OPENWEATHER_API_KEY != null) {
				apiParam = "&APPID=" + process.env.OPENWEATHER_API_KEY;
			} else if (this.settings.apiKey != null) {
				apiParam = "&APPID=" + this.settings.apiKey;
			}

			this.logger.info("Refreshing weather info...");

			this.result.now = await this.fetchInfo(
				`${BASE_URL}/weather?units=${unit}&lang=${lang}${apiParam}&q=${location}`
			);
			this.result.forecast = await this.fetchInfo(
				`${BASE_URL}/forecast/daily?units=${unit}&lang=${lang}${apiParam}&cnt=7&q=${location}`
			);
			this.result.today = await this.fetchInfo(
				`${BASE_URL}/forecast?units=${unit}&lang=${lang}${apiParam}&cnt=10&q=${location}`
			);

			this.result.updatedAt = Date.now();

			this.logger.debug("Weather refreshed.", this.result);

			this.broker.broadcast("weather.info.updated", this.result);
		},

		async fetchInfo(url) {
			const res = await fetch(url);
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
