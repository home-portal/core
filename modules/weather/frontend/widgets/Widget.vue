<template>
	<current-info v-if="results" :data="results.now" :settings="settings" :show-location="true" class="h-full cursor-pointer" @click="goToWeather()" />
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
			results: null
		};
	},

	events: {
		"weather.info.updated"(ctx) {
			this.results = ctx.params;
		}
	},

	methods: {
		goToWeather() {
			this.broker.call('$router.goTo', { page: 'weather' });
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("weather");
		//console.log("Module settings", this.settings);
	},

	async mounted() {
		this.results = await this.broker.call("weather.get");
	}
};
</script>
