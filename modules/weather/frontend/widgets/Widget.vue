<template>
	<div class="panel">
		<div class="location">{{ location }}</div>
		<div class="row">
			<div :class="'weather-image code-' + weatherImageCode"></div>
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
			weatherImageCode: null,
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

				this.weatherImageCode =
					now.weather && now.weather[0] && now.weather[0].icon
						? now.weather[0].icon
						: null;
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

	.weather-image {
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		width: 40%;
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
		margin-top: -0.5em;
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

	.weather-image {
		&.code-01d {
			background-image: url(../images/weather-icons/32.png);
		}
		&.code-02d {
			background-image: url(../images/weather-icons/34.png);
		}
		&.code-03d {
			background-image: url(../images/weather-icons/30.png);
		}
		&.code-04d {
			background-image: url(../images/weather-icons/28.png);
		}
		&.code-09d {
			background-image: url(../images/weather-icons/39.png);
		}
		&.code-10d {
			background-image: url(../images/weather-icons/39.png);
		}
		&.code-11d {
			background-image: url(../images/weather-icons/17.png);
		}
		&.code-13d {
			background-image: url(../images/weather-icons/16.png);
		}
		&.code-50d {
			background-image: url(../images/weather-icons/21.png);
		}
		&.code-01n {
			background-image: url(../images/weather-icons/31.png);
		}
		&.code-02n {
			background-image: url(../images/weather-icons/33.png);
		}
		&.code-03n {
			background-image: url(../images/weather-icons/29.png);
		}
		&.code-04n {
			background-image: url(../images/weather-icons/27.png);
		}
		&.code-09n {
			background-image: url(../images/weather-icons/45.png);
		}
		&.code-10n {
			background-image: url(../images/weather-icons/45.png);
		}
		&.code-11n {
			background-image: url(../images/weather-icons/47.png);
		}
		&.code-13n {
			background-image: url(../images/weather-icons/46.png);
		}
		&.code-50n {
			background-image: url(../images/weather-icons/33.png);
		}
	}
}
</style>
