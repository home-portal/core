<template>
	<div class="weather-now">
		<div class="icon wi wi-day-cloudy-windy"></div>
		<div class="temp">12
			<sup>°C</sup>
		</div>
	</div>
</template>

<script>
export default {
	props: ["now", "settings"]
}
</script>

<style lang="scss" scoped>
.weather-now {
	margin: 1rem;
	font-weight: 300;
	text-shadow: 1px 1px 6px rgba(black, 1.0);

	display: flex;
	align-items: center;

	.icon {
    font-size: 1.5em;
    margin-right: 0.5em;
	}

	.temp {
		font-size: 2em;

		sup {
			margin-left: -0.25em;
		}
	}
}
</style>
