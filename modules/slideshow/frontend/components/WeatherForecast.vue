<template>
	<div :class="'weather-forecast position ' + settings.position">
		<div v-for="item in list" :key="item.day" class="forecast-day">
			<div class="day">{{item.day}}</div>
			<div :class="'icon ' + item.icon"></div>
			<div class="temp">
				{{ Math.round(item.temperature.max) }}°
				<span class="separator">/</span>
				{{ Math.round(item.temperature.min) }}°
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["now", "settings"],

	data() {
		return {
			list: [
				{ day: "Wed", temperature: { min: 6.35, max: 10.87 }, icon: "wi wi-day-snow" },
				{ day: "Thu", temperature:  { min: 6.42, max: 9.75 }, icon: "wi wi-day-sunny" },
				{ day: "Fri", temperature: { min: 5.79, max: 10.37 }, icon: "wi wi-day-cloudy-windy" },
				{ day: "Sat", temperature:  { min: 4.51, max: 10.91 }, icon: "wi wi-sunrise" }
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.weather-forecast {
	margin: 1rem;
	font-weight: 400;
	text-shadow: 1px 1px 6px rgba(black, 1);

	display: flex;
	align-items: center;

	.forecast-day {
		margin: 0 0.75em;
		text-align: center;

		.day {
			margin-bottom: 0.5em;
		}
		.icon {
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
