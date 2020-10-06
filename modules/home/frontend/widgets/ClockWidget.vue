<template>
	<div class="panel date-time">
		<div class="time">{{ time }}</div>
		<div class="date">{{ date }}</div>
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

<style lang="scss" scoped>
.panel.date-time {
	height: 100%;
	display: flex;
	flex-direction: column;
	border-radius: var(--panelRadius);

	.time {
		flex: 1;
		font-size: 5em;
		line-height: 1.2em;
		text-align: center;
	}

	.date {
		background-color: var(--bg1);
		font-size: 1.5rem;
		line-height: 2.5rem;
		text-align: center;
		border-radius: 0 0 var(--panelRadius) var(--panelRadius);
	}
}

</style>
