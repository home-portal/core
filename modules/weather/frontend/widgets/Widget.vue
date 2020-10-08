<template>
	<div class="panel">
		<div class="location">{{ location }}</div>
		<div class="row">
			<img :src="image" />
			<div class="temperature">
				<span>{{ temperature }}</span>
				<span class="degree">°C</span>
			</div>
		</div>

		<div class="description">{{ description }}</div>

		<div class="row bottom">
			<div class="info">
				<i class="wi wi-strong-wind"></i>
				<span class="wind-speed">
					<span
						class="wi wi-down"
						:style="'transform: rotate(' + windDeg + 'deg)'"
					></span>
					<span class="value">{{ windSpeed }}</span>
					<span>km/h</span>
				</span>
			</div>
			<div class="info">
				<i class="wi wi-sprinkles"></i>
				<span class="humidity">
					<span class="value">{{ humidity }}</span>
					<span>%</span>
				</span>
			</div>
			<div class="info">
				<i class="wi wi-sunset"></i>
				<span class="sunset">
					<span class="value">{{ sunset }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

export default {
	data() {
		return {
			image: "",
			location: "Budapest, HU",
			temperature: 23,
			description: "Some text",
			windSpeed: 2.5,
			windDeg: 120,
			humidity: 98,
			sunset: "20:21"
		};
	},

	events: {
		"weather.info.updated"(ctx) {
			this.updateWeatherInfo(ctx.params);
		}
	},

	methods: {
		async updateWeatherInfo(data) {
			if (!data) {
				data = await this.broker.call("weather.get");
			}
			console.log("updateWeatherInfo", data);
			if (data.now) {
				const now = data.now;
				this.location = now.name + ", " + now.sys.country;
				this.temperature = now.main && now.main.temp ? Math.round(now.main.temp) : "-";
				this.description =
					now.weather && now.weather[0] && now.weather[0].description
						? _.capitalize(now.weather[0].description)
						: "";
				this.windSpeed = now.wind && now.wind.speed ? now.wind.speed : "-";
				this.windDeg = now.wind && now.wind.deg ? now.wind.deg : "0";
				this.humidity = now.main && now.main.humidity ? now.main.humidity : "-";
				this.sunset =
					now.sys && now.sys.sunset ? moment(now.sys.sunset * 1000).format("LT") : "-";

				/*this.image =
					now.weather && now.weather[0] && now.weather[0].icon
						? `../images/${this.getWeatherIcon(now.weather[0].icon)}.png`
						: null;
						*/
				this.image = "http://192.168.0.205:3000/images/base-weather/weather-icons/33.png";
			}
		},

		getWeatherIcon(iconCode) {
			switch (iconCode) {
				case "01d":
					return "32";
				case "02d":
					return "34";
				case "03d":
					return "30";
				case "04d":
					return "28";
				case "09d":
					return "39";
				case "10d":
					return "39";
				case "11d":
					return "17";
				case "13d":
					return "16";
				case "50d":
					return "21";
				case "01n":
					return "31";
				case "02n":
					return "33";
				case "03n":
					return "29";
				case "04n":
					return "27";
				case "09n":
					return "45";
				case "10n":
					return "45";
				case "11n":
					return "47";
				case "13n":
					return "46";
				case "50n":
					return "33";
			}
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("weather");
		console.log("Module settings", this.settings);
	},

	async mounted() {
		await this.updateWeatherInfo();
	}
};
</script>

<style lang="scss" scoped>
.panel {
	height: 100%;
	display: flex;
	flex-direction: column;
	border-radius: var(--panelRadius);

	.row {
		display: flex;
		> div {
			flex: 1;
		}
	}

	img {
		margin-top: -0.5em;
		//max-width: 40%;
		height: 100%;
	}

	.location {
		background-color: var(--bg1);
		font-size: 1.2em;
		line-height: 1.5em;
		text-align: center;
		border-radius: var(--panelRadius) var(--panelRadius) 0 0;
	}

	.temperature {
		margin-top: -0.1em;
		margin-right: 0.2em;
		font-size: 5em;
		//line-height: 1.5em;
		font-weight: 300;
		vertical-align: top;
		text-align: right;

		.degree {
			margin-left: -0.5em;
			font-size: 0.4em;
			vertical-align: super;
		}
	}

	.description {
		margin-top: -1em;
		margin-bottom: 0.25em;
		text-align: center;
		vertical-align: top;
		font-weight: 300;
		font-size: 1.4em;
	}

	.row.bottom {
		padding: 0 0.5em;
		font-size: 0.8em;
		align-items: flex-end;
	}

	.info {
		&:nth-child(1) {
			text-align: left;
		}
		&:nth-child(2) {
			text-align: center;
		}
		&:nth-child(3) {
			text-align: right;
		}

		i {
			margin-right: 4px;
			color: lighten(rgb(255, 49, 0), 15%);
		}

		span {
			font-weight: 400;
		}

		.wind-speed {
			.value {
				padding-left: 0.2em;
			}

			.wi-down {
				font-size: 1.8em;
				font-weight: 400;
				transform: rotate(0deg);
			}
		}
	}
}
</style>
