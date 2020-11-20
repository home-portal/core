<template>
	<div :class="'weather-now position ' + settings.position">
		<div class="icon wi wi-day-cloudy-windy"></div>
		<div v-if="temperature" class="temp">{{ temperature }}
			<span :class="'degree ' + data.unit"></span>
		</div>
	</div>
</template>

<script>
export default {
	props: ["settings", "data"],

	computed: {
		temperature() {
			return this.data?.current?.temperature ? Math.round(this.data.current.temperature) : null;
		}
	}
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
		font-size: 1.5rem;
		margin-right: 0.5em;
	}

	.temp {
		font-size: 2.5rem;

		.degree {
			margin-left: -0.25em;
			font-size: 0.6em;
			vertical-align: top;
		}
	}
}
</style>
