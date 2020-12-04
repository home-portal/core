<template>
	<div :class="'weather-now position ' + settings.position">
		<div :class="'icon wi ' + weatherIcon"></div>
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
			return this.data?.current?.temperature != null ? Math.round(this.data.current.temperature) : null;
		},
		weatherIcon() {
			return window.HomePortal.utils.getWeatherIconByType(this.data?.current?.icon, "normal");
		}
	}
}
</script>

<style lang="scss" scoped>
.weather-now {
	margin: 1rem;
	font-size: 1.2rem;
	font-weight: 300;
	text-shadow: 1px 1px 6px rgba(black, 1.0);

	display: flex;
	align-items: center;

	.icon {
		font-size: 1.8em;
		margin-right: 0.5em;
	}

	.temp {
		font-size: 2.5em;

		.degree {
			margin-left: -0.25em;
			font-size: 0.4em;
			vertical-align: super;
		}
	}
}
</style>
