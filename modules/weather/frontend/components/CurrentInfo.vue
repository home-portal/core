<template>
	<div class="panel" @click="$emit('click', $event)">
		<div v-if="showLocation" class="location">{{ location }}</div>
		<div class="row main">
			<div v-if="weatherImageCode" :class="'weather-image code-' + weatherImageCode"></div>
			<div v-if="temperature" class="temperature">
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
// Get the dependencies from the core, so it won't be bundled again into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

export default {
	props: ["showLocation", "data"],

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

	methods: {
		async updateWeatherInfo(now) {
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
				now.weather && now.weather[0] && now.weather[0].icon ? now.weather[0].icon : null;
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
		align-items: flex-end;
		margin-bottom: 0.5em;
	}

	.info {
		flex: 1;

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
