<template>
	<div class="page">
		<iframe :src="opts.url"></iframe>
		<div class="back-button" @click="broker.call('$router.goHome')"></div>
	</div>
</template>

<script>
export default {
	props: {
		opts: Object
	}
};
</script>

<style lang="scss" scoped>
iframe {
	position: absolute;
	width: 100%;
	height: 100%;
	background: white;
	color: black;
}
</style>
