<template>
	<div v-if="radar">
		<video v-if="radar.video" autoplay loop :src="radar.video"></video>
		<img v-if="radar.image" :src="radar.image" />
	</div>
</template>

<script>
export default {
	props: ["radar", "settings"]
}
</script>

<style lang="scss" scoped>
div {
	text-align: center;

	video {
		width: 100%;
		height: 100%;
		border-radius: var(--panelRadius);
	}

	img {
		height: 15em;
		width: auto;
		border-radius: var(--panelRadius);
	}
}
</style>
