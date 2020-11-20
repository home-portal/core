<template>
	<div :class="'clock position ' + settings.position">
		<div v-if="settings.showTime" class="time">{{ time }}</div>
		<div v-if="settings.showDate" class="date">{{ date }}</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;

export default {
	props: ["settings"],

	data() {
		return {
			timeTimer: null,
			time: null,
			date: null,
		};
	},

	methods: {
		updateTimeInfo() {
			this.time = moment().format(this.settings.timeFormat || "LT")
			this.date = moment().format(this.settings.dateFormat || "LL")
		}
	},

	async created() {
		this.timeTimer = setInterval(() => this.updateTimeInfo());
		this.updateTimeInfo();
	}
};
</script>

<style lang="scss">
	.clock {
		margin: 1rem;

		font-weight: 400;

		//border-radius: 0 var(--panelRadius) var(--panelRadius) 0;
		text-shadow: 2px 2px 12px rgba(black, 1.0);
		color: rgba(White, 0.9);

		.time {
			display: block;
			font-size: 4.5em;
			line-height: 1.0em;
			text-align: center;
		} // .time

		.date {
			font-size: 1.3em;
			margin-top: 0.5em;
			line-height: 1.0em;
			text-align: center;
		} // .date

	} // .clock
</style>
