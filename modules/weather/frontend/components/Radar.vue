<template>
	<div>
		<video v-if="radar && radar.url" autoplay loop :src="radar.url"></video>
	</div>
</template>

<script>
export default {
	props: ["radar"]
}
</script>

<style lang="scss" scoped>
	video {
		width: 100%;
		height: 100%;
		border-radius: var(--panelRadius);
	}
</style>
