<template>
	<div v-if="radar">
		<video v-if="radar.video" ref="video" autoplay loop muted :src="radar.video"></video>
		<img v-if="radar.image" :src="radar.image" />
	</div>
</template>

<script>
export default {
	props: ["radar", "settings", "active"],

	watch: {
		active(val) {
			const video = this.$refs.video;
			if (!video) return;
			if (val) {
				video.currentTime = 0;
				video.play().catch(() => {});
			} else {
				video.pause();
			}
		}
	}
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
