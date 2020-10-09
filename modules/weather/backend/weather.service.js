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
			const location = encodeURIComponent(this.settings.location || "London");
			let apiParam = "";
			if (this.settings.apiKey != null) {
				apiParam = "&APPID=" + this.settings.apiKey;
			}

			this.logger.info("Refreshing weather info...");

			this.result.now = await this.fetchInfo(
				`${BASE_URL}/weather?units=metric&lang=${lang}${apiParam}&q=${location}`
			);
			this.result.forecast = await this.fetchInfo(
				`${BASE_URL}/forecast/daily?units=metric&lang=${lang}${apiParam}&cnt=7&q=${location}`
			);
			this.result.today = await this.fetchInfo(
				`${BASE_URL}/forecast?units=metric&lang=${lang}${apiParam}&cnt=10&q=${location}`
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
