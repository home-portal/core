<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="page-content">
		<div class="page-title">Traffic map</div>
		<div class="back-button" @click="broker.call('$router.goHome')"></div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
		};
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-image: url("./images/background.jpg");
}

</style>
