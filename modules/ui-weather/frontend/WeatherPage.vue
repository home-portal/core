<template>
	<div class="page">
		<!-- <div class="overlay"></div> -->
		<div class="wrapper">
			<div class="page-header">
				<div class="title">
					<span v-if="location">Weather in {{ location }}</span>
					<span v-else>Weather</span>
				</div>
				<div class="back-button" @click="broker.call('$router.goHome')"></div>
			</div>
			<div class="page-content">
				<div class="main" style="margin: 1em">
					<div class="left" style="margin-right: 1em">
						<div class="today">
							<current-info :data="weatherData" :settings="settings" :show-location="false" />
						</div>
						<div class="today-forecast">
							<today-forecast :data="weatherData" :settings="settings" />
						</div>
					</div>
					<div class="right">
						<radar :radar="radar" :settings="settings" />
					</div>
				</div>
				<div class="forecast">
					<week-forecast :data="weatherData" :settings="settings" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

import Radar from "./components/Radar";
import CurrentInfo from "./components/CurrentInfo";
import TodayForecast from "./components/TodayForecast";
import WeekForecast from "./components/WeekForecast";

export default {
	components: {
		CurrentInfo,
		Radar,
		TodayForecast,
		WeekForecast,
	},

	data() {
		return {
			settings: {}, // mixin
			weatherData: null
		};
	},

	computed: {
		location() {
			let s;
			if (this.weatherData && this.weatherData.location) {
				s = this.weatherData.location;

			if (this.weatherData.country)
				s += ", " + this.weatherData.country;
			};

			return s;
		},

		radar() {
			return this.settings.radar;
		}
	},

	events: {
		"current.weather.updated"(ctx) {
			this.weatherData = ctx.params;
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("ui-weather");
		//console.log("Module settings", this.settings);
	},

	async mounted() {
		this.weatherData = await this.broker.call("current.get", { key: "weather" });
	}
};
</script>

<style lang="scss" scoped>
$c: rgb(0, 181, 255); //var(--skyBlue);

.page {
	background-image: url("./images/background.jpg");
}

.overlay {
	background-color: rgba($c, 0.25);
}

.page-content {
	//margin: 2em;
	display: flex;
	flex-direction: column;

	.main {
		flex: 1;
		display: flex;

		.left {
			flex: 1;
			display: flex;
			flex-direction: column;

			.today {
				flex: 1;
			}
		}

		.right {
			flex: 1;
		}
	}
}
</style>
