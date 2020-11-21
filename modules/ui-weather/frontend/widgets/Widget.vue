<template>
	<current-info v-if="weatherData" :data="weatherData" :settings="settings" :show-location="true" class="h-full cursor-pointer" @click="goToWeather()" />
</template>

<script>
// Get the dependencies from the core, so it won't be bundled again into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

import CurrentInfo from "../components/CurrentInfo.vue";

export default {
	components: {
		CurrentInfo
	},

	data() {
		return {
			weatherData: null
		};
	},

	events: {
		"current.weather.updated"(ctx) {
			this.weatherData = ctx.params;
		}
	},

	methods: {
		goToWeather() {
			this.broker.call('$router.goTo', { page: 'weather' });
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
