<template>
	<div :class="'weather-forecast position ' + settings.position">
		<div v-for="item in items" :key="item.day" class="forecast-day">
			<div class="day">{{ item.date | ddd }}</div>
			<div :class="'wi ' + wiIcon(item.icon)"></div>
			<div class="temp">
				{{ Math.round(item.temperature.max) }}°
				<span class="separator">/</span>
				{{ Math.round(item.temperature.min) }}°
			</div>
		</div>
	</div>
</template>

<script>
const moment = HomePortal.dependencies.moment;

export default {
	props: ["data", "settings"],

	computed: {
		items() {
			return this.data?.forecast?.slice(0,this.settings.days || 3) || [];
		},
	},

	filters: {
		ddd(val) {
			return moment(val).format("ddd");
		},
	},

	methods: {
		wiIcon(type) {
			switch(type) {
				case "clear": return "wi-day-sunny";
				case "few-clouds": return "wi-cloudy";
				case "clouds": return "wi-cloudy";
				case "broken-clouds": return "wi-cloudy-windy";
				case "showers": return "wi-showers";
				case "rain": return "wi-rain";
				case "thunderstorm": return "wi-thunderstorm";
				case "snow": return "wi-snow";
				case "fog": return "wi-fog";
				case "night-clear": return "wi-clear";
				case "night-few-clouds": return "wi-cloudy";
				case "night-clouds": return "wi-cloudy";
				case "night-broken-clouds": return "wi-cloudy-windy";
				case "night-showers": return "wi-showers";
				case "night-rain": return "wi-rain";
				case "night-thunderstorm": return "wi-thunderstorm";
				case "night-snow": return "wi-snow";
				case "night-fog": return "wi-fog";
			}
		}
	},

};
</script>

<style lang="scss" scoped>
.weather-forecast {
	margin: 1rem;
	font-size: 1.2rem;
	font-weight: 400;
	text-shadow: 1px 1px 6px rgba(black, 1);

	display: flex;
	align-items: center;

	.forecast-day {
		margin: 0 0.75em;
		text-align: center;

		.day {
			margin-bottom: 0.5em;
			color: rgba(white, 0.8);
		}
		.wi {
			font-size: 1.5em;
			margin-bottom: 0.5em;
		}

		.temp {
			.separator {
				color: rgba(white, 0.5);
			}
		}
	}
}
</style>
