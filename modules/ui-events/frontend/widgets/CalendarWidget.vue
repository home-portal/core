<template>
	<div class="">
		<ul>
			<li v-for="event in upcomingEvents" :key="event.id">
				<div class="time">{{ eventTime(event) }}</div>
				<div class="title">{{ eventCaption(event) }}</div>
			</li>
		</ul>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled again into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

export default {
	components: {
	},

	computed: {
		upcomingEvents() {
			if (!this.data) return [];

			let list = [];
			Object.values(this.data).forEach(calItem => {
				if (this.settings.widget.calendars && !this.settings.widget.calendars.includes(calItem.name)) return;
				list.push(calItem.events);
			});
			list = _.flattenDeep(list);

			// Skipping day events
			if (this.settings.skipDayEvents)
				list = list.filter(event => !event.isDayEvent);

			list.sort((a, b) => a.startDate - b.startDate);

			return list.slice(0, this.settings.widget.count);
		},
	},

	data() {
		return {
			data: null
		};
	},

	events: {
		"current.events.updated"(ctx) {
			this.data = ctx.params;
		}
	},

	methods: {
		goToPage() {
			//this.broker.call('$router.goTo', { page: 'events' });
		},

		eventTime(event) {
			if (event.isDayEvent) {
				const ds = moment(event.startDate);
				const de = moment(event.endDate);

				if (de.diff(ds, "days") > 1)
					return ds.format("MMM D") + " - " + de.format("MMM D")
				else
					return ds.format("MMM D");

			} else {
				const d = moment(event.startDate);
				if (d.isSame(moment()), "day")
					return d.format("LT");
				else
					return d.format("MMM D") + " " + d.format("LT");
			}
		},

		eventCaption(event) {
			return _.truncate(event.title, { length: 35 });
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("ui-events");
		//console.log("Module settings", this.settings);
	},

	async mounted() {
		this.data = await this.broker.call("current.get", { key: "events" });
	}
};
</script>

<style lang="scss" scoped>
ul {
	padding: 0em;

	li {
		margin: 0.3em 0;
		background-color: rgba(black, 0.5);
		border-radius: 1em;

		display: flex;

		.time {
			min-width: 5em;
			text-align: right;
			background-color: var(--bg1);
			padding: 0.1em 0.5em;
			border-radius: 1em 0 0 1em;
		}

		.title {
			flex: 1;
			padding: 0.1em 0.5em;
		}
	}
}

</style>
