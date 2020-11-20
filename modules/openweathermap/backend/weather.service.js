const _ = require("lodash");
const fetch = require("node-fetch");
const Moleculer = require("moleculer");
const { writeToTemp } = require("../../../backend/utils");

const BASE_URL = "http://api.openweathermap.org/data/2.5";

const WEATHER_ICON_TO_CONST = {
	"01d": "clear",
	"02d": "few-clouds",
	"03d": "clouds",
	"04d": "broken-clouds",
	"09d": "showers",
	"10d": "rain",
	"11d": "thunderstorm",
	"13d": "snow",
	"50d": "fog",
	"01n": "night-clear",
	"02n": "night-few-clouds",
	"03n": "night-clouds",
	"04n": "night-broken-clouds",
	"09n": "night-showers",
	"10n": "night-rain",
	"11n": "night-thunderstorm",
	"13n": "night-snow",
	"50n": "night-mist"
};

module.exports = {
	name: "openweathermap",
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
		speed(val, unit) {
			if (val == null) return null;
			if (unit == "imperial") return val; // mph

			// Convert m/s -> km/h
			return val * 3.6;
		},

		precipitation(val, unit) {
			if (val == null) return null;
			if (unit == "imperial") return val / 25.4; // inch
			return val; // mm

		},

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

			this.logger.info("Weather refreshed.");
			writeToTemp("openweathermap", this.result);

			this.broker.broadcast("openweathermap.data.updated", this.result);

			// Create "current" data
			const payload = {
				unit,
				lang
			};
			if (this.result.now) {
				const now = this.result.now;
				payload.location = now.name;
				payload.country = now.sys ? now.sys.country : null;
				payload.updatedAt = now.dt ? now.dt * 1000 : null;
				payload.current = {
					temperature: now.main.temp,
					pressure: now.main.pressure,
					humidity: now.main.humidity,
					wind: now.wind ? {
						speed: this.speed(now.wind.speed, unit),
						degree: now.wind.deg,
					} : undefined,
					caption: now.weather[0].main,
					description: _.capitalize(now.weather[0].description),
					icon: WEATHER_ICON_TO_CONST[now.weather[0].icon],
					precipitation: this.precipitation(now.rain || now.snow),
					sunset: now.sys && now.sys.sunset ? now.sys.sunset * 1000 : null,
					sunrise: now.sys && now.sys.sunrise? now.sys.sunrise * 1000 : null,
				}
			}

			if (this.result.forecast) {
				const forecast = this.result.forecast;
				payload.forecast = forecast.list.map(item => {
					return {
						date: item.dt * 1000,
						temperature: {
							min: item.temp.min,
							max: item.temp.max,
						},
						humidity: item.humidity,
						pressure: item.pressure,
						wind: {
							speed: this.speed(item.speed, unit),
							degree: item.deg,
						},
						caption: item.weather[0].main,
						description: _.capitalize(item.weather[0].description),
						icon: WEATHER_ICON_TO_CONST[item.weather[0].icon],
						precipitation: this.precipitation(item.rain || item.snow)
					}
				});
			}

			if (this.result.today) {
				const today = this.result.today;
				payload.today = today.list.map(item => {
					return {
						ts: item.dt,
						temperature: item.main.temp,
						humidity: item.main.humidity,
						pressure: item.main.pressure,
						wind: item.wind ? {
							speed: this.speed(item.wind.speed, unit),
							degree: item.wind.deg,
						} : undefined,
						caption: item.weather[0].main,
						description: _.capitalize(item.weather[0].description),
						icon: WEATHER_ICON_TO_CONST[item.weather[0].icon],
						precipitation: this.precipitation(item.rain || item.snow)
					}
				});
			}

			this.broker.call("current.update", {
				key: "weather",
				payload
			});
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
