<template>
	<div class="panel" @click="$emit('click', $event)">
		<div v-if="showLocation" class="location">{{ location }}</div>
		<div class="row main">
			<div v-if="weatherImageCode" :class="'weather-image code-' + weatherImageCode"></div>
			<div v-if="temperature" class="temperature">
				<span>{{ temperature }}</span>
				<span :class="'degree ' + settings.unit"></span>
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
					<span class="value">{{ windSpeed | speed(settings.unit) }}</span>
				</span>
			</div>
			<div class="info">
				<i class="wi wi-humidity"></i>
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
// Get the dependencies from the core, so it won't be bundled again into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

export default {
	props: ["showLocation", "settings", "data"],

	data() {
		return {
			weatherImageCode: null,
			location: null,
			temperature: null,
			description: null,
			windSpeed: null,
			windDeg: null,
			humidity: null,
			sunset: null
		};
	},

	filters: {
		//  Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
		speed(val, unit) {
			if (unit == "imperial") return `${val} mph`;

			const kmh = val * 3.6;
			return `${val} km/h`;
		}
	},

	methods: {
		async updateWeatherInfo(now) {
			this.location = now.name + ", " + now.sys.country;
			this.temperature = now.main && now.main.temp != null ? Math.round(now.main.temp) : "-";
			this.description =
				now.weather && now.weather[0] && now.weather[0].description != null
					? _.capitalize(now.weather[0].description)
					: "";
			this.windSpeed = now.wind && now.wind.speed != null ? now.wind.speed : "-";
			this.windDeg = now.wind && now.wind.deg != null ? now.wind.deg : "0";
			this.humidity = now.main && now.main.humidity != null ? now.main.humidity : "-";
			this.sunset =
				now.sys && now.sys.sunset != null
					? moment(now.sys.sunset * 1000).format("LT")
					: "-";

			this.weatherImageCode =
				now.weather && now.weather[0] && now.weather[0].icon != null
					? now.weather[0].icon
					: null;
		}
	},

	watch: {
		data() {
			if (this.data) this.updateWeatherInfo(this.data);
		}
	},

	async mounted() {
		if (this.data) this.updateWeatherInfo(this.data);
	}
};
</script>

<style lang="scss" scoped>
.panel {
	display: flex;
	flex-direction: column;
	border-radius: var(--panelRadius);
	user-select: none;

	.row {
		display: flex;
	}

	.location {
		background-color: var(--bg1);
		font-size: 1.2em;
		line-height: 1.5em;
		text-align: center;
		border-radius: var(--panelRadius) var(--panelRadius) 0 0;
	}

	.main {
		flex: 1;
	}

	.weather-image {
		flex: 1;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		height: 5em;
	}

	.temperature {
		flex: initial;
		margin-right: 0.3em;
		padding-top: 0.1em;
		font-size: 4em;
		line-height: 1em;
		font-weight: 400;
		vertical-align: top;
		text-align: right;

		.degree {
			margin-left: -0.5em;
			font-size: 0.4em;
			vertical-align: super;
		}
	}

	.description {
		text-align: center;
		font-weight: 300;
		font-size: 1.2em;
	}

	.row.bottom {
		padding: 0 0.5em;
		font-size: 0.8em;
		justify-content: space-around;
		align-items: flex-end;
		margin-bottom: 0.5em;
	}

	.info {
		text-align: center;

		i {
			margin-right: 4px;
			color: lighten(rgb(255, 49, 0), 15%);
		}

		span {
			font-weight: 400;
		}

		.wi-sprinkles {
			font-size: 1.5em;
			top: 0.1em;
			position: relative;
		}

		.wind-speed {
			.value {
				padding-left: 0.2em;
			}

			.wi-down {
				position: relative;
				top: 0.15em;
				font-size: 1.8em;
				font-weight: 400;
				transform: rotate(0deg);
			}
		}
	}
}
</style>
