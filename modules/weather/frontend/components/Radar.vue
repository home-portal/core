<template>
	<div class="panel">
		<video v-if="radar && radar.url" autoplay loop :src="radar.url"></video>
	</div>
</template>

<script>
export default {
	props: ["radar"]
}
</script>

<style lang="scss" scoped>

</style>
