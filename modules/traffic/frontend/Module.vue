<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="page-title">Traffic map</div>
		<div class="back-button" @click="broker.call('$router.goHome')"></div>
		<div class="page-content">
			<div class="map"></div>
			<div class="info">
				<div class="row">
					<div class="title">Time</div>
					<div class="value">time</div>
				</div>
				<div class="row">
					<div class="title">Distance</div>
					<div class="value">distance</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
			settings: {}, // mixin
			time: "-",
			distance: "-"
		};
	},

	created() {
		//this.settings = HomePortal.getModuleSettings("home");
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-image: url("./images/background.jpg");
}
</style>
