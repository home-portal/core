<template>
	<div :class="'events position ' + settings.position">
		<div class="event-row flex flex-row" :style="getRowStyle(event, $index)" v-for="(event, $index) in upcomingEvents" :key="event.id">
			<div>
				<div class="date">
					<div class="month">{{ event.startDate | month }}</div>
					<div class="day">{{ event.startDate | day }}</div>
				</div>
			</div>
			<div class="event-content">
				<div class="dow">{{ event.startDate | dow }}</div>
				<div class="title">{{ truncate(event.title, 30) }}</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const _ = HomePortal.dependencies.lodash;

export default {
	props: ["settings", "data"],

	computed: {
		upcomingEvents() {
			if (!this.data) return [];

			let list = [];
			Object.values(this.data).forEach(calItem => {
				if (this.settings.calendars && !this.settings.calendars.includes(calItem.name)) return;
				list.push(calItem.events);
			});
			list = _.flattenDeep(list);

			// Skipping day events
			if (this.settings.skipDayEvents)
				list = list.filter(event => !event.isDayEvent);

			list.sort((a, b) => a.startDate - b.startDate);

			return list.slice(0, this.settings.count);
		}
	},

	filters: {
		dow(v) {
			return moment(v).format("dddd");
		},

		month(v) {
			return moment(v).format("MMM");
		},

		day(v) {
			return moment(v).format("D");
		}
	},

	methods: {
		truncate(str, len) {
			return _.truncate(str, len);
		},

		getRowStyle(event, index) {
			if (this.settings.fading) {
				const total = this.upcomingEvents.length;
				if (total == 0) return;

				const minOpacity = 0.4;
				const opacity = 1 - (index / (total - 1) * ( 1 - minOpacity));

				return {
					opacity
				};
			}

			return {};
		}
	}
}
</script>

<style lang="scss" scoped>
.events {
	margin: 1rem;
	font-size: 1.2rem;
	font-weight: 300;
	text-shadow: 1px 1px 6px rgba(black, 1.0);

	.event-row {
		margin-bottom: 1em;

		.date {
			font-size: 0.7em;
			border: 1px solid white;
			border-radius: 4px;

			.month {
				background: white;
				color: black;
				text-shadow: none;
				padding: 0px 4px;
			}

			.day {
				padding: 0px 4px;
				text-align: center;
				font-weight: bold;
			}
		}

		.event-content {
			margin-left: 0.75em;
			line-height: 1.1em;
			font-weight: normal;

			.dow {
				color: rgba(white, 0.7);
				//font-weight: bold;
				font-size: 0.75em;
			}
		}
	}
}
</style>
