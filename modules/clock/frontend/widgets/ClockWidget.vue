<template>
	<div class="panel h-full flex flex-col rounded-md">
		<div class="flex-1 text-center overflow-hidden text-r6">{{ time }}</div>
		<div class="highlighted bottom text-2xl text-center">{{ date }}</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module.
const moment = HomePortal.dependencies.moment;

export default {
	data() {
		return {
			timer: null,
			date: null,
			time: null
		};
	},

	methods: {
		update() {
			this.time = moment().format("LT");
			this.date = moment().format("LL");
		}
	},

	created() {
		this.update();
		this.timer = setInterval(() => this.update(), 10 * 1000);
	},

	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	}
};
</script>
