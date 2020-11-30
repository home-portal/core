<template>
	<div :class="'events position ' + settings.position">
		<table>
			<tbody>
				<tr class="event-row" :style="getRowStyle($index)" v-for="(events, day, $index) of dailyEvents" :key="day">
					<td>
						<div class="date">
							<div class="month">{{ day | month }}</div>
							<div class="day">{{ day | day }}</div>
						</div>
					</td>
					<td class="event-content">
						<div class="dow">{{ day | dow }}</div>
						<div class="title" v-for="event of events" :key="event.id">
							<span class="startTime" v-if="!event.isDayEvent">{{ event.startDate | hmm }} - {{ event.endDate | hmm }}: </span>
							<span>{{ truncate(event.title, 100) }}</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
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
		},

		dailyEvents() {
			const res = {};

			this.upcomingEvents.forEach(event => {
				const d = new Date(event.startDate);
				const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).valueOf();

				if (!res[day])
					res[day] = [];

				res[day].push(event);
			});

			return res;
		}
	},

	filters: {
		dow(v) {
			return moment(Number(v)).format("dddd");
		},

		month(v) {
			return moment(Number(v)).format("MMM");
		},

		hmm(v) {
			return moment(Number(v)).format("LT");
		},

		day(v) {
			return moment(Number(v)).format("D");
		}
	},

	methods: {
		truncate(str, length) {
			return _.truncate(str, { length });
		},

		getRowStyle(index) {
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
	font-size: 1.1rem;
	font-weight: 300;
	text-shadow: 1px 1px 6px rgba(black, 1.0);

	table {
		max-width: 50%;
	}

	tr {
		td:nth-child(1) {
			padding-right: 0.75em;
			vertical-align: top;
		}

		.date {
			font-size: 0.7em;
			border: 1px solid white;
			border-radius: 4px;

			.month {
				background: white;
				color: black;
				text-shadow: none;
				text-align: center;
				padding: 0px 4px;
			}

			.day {
				padding: 0px 4px;
				text-align: center;
				font-weight: bold;
			}
		}

		.event-content {
			padding-bottom: 0.5em;
			line-height: 1.1em;
			font-weight: normal;

			.dow {
				color: rgba(white, 0.7);
				//font-weight: bold;
				font-size: 0.75em;
			}

			.startTime {
				color: rgba(white, 0.7);
				font-size: 0.9em;
			}

			.title {
				padding-bottom: 0.5em;
			}
		}
	}
}
</style>
