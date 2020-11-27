const _ = require("lodash");
const fetch = require("node-fetch");
const moment = require("moment");
const Moleculer = require("moleculer");
const { writeToTemp } = require("../../../backend/utils");
const ical = require("node-ical");

module.exports = {
	name: "calendar",
	mixins: [Moleculer.Mixins.ModuleConfigMixin, Moleculer.Mixins.ModuleSettingsMixin],

	actions: {
		get() {
			return this.result;
		},

		refresh() {
			return this.refresh();
		}
	},

	methods: {
		async refresh() {
			if (Array.isArray(this.settings.calendars))	{
				await Promise.all(this.settings.calendars.map(opts => this.refreshCalendar(opts)));

				this.broker.call("current.update", {
					key: "events",
					payload: this.result
				});
			}
		},

		convertEventDate(v) {
			return moment(new Date(v));
		},

		async refreshCalendar(opts) {
			this.logger.info(`Refreshing calendar '${opts.name}'...`);
			try {
				// const response = await this.fetchInfo(opts.url);
				// writeToTemp(`calendar-response-${opts.name}`, response);
				// const data = ical.parseICS(response);
				const data = await ical.async.fromURL(opts.url);

				writeToTemp(`calendar-parsed-${opts.name}`, data);

				const events = [];

				const now = moment();
				const today = now.startOf("day");
				const maxDay = this.settings.maxDays > 0 ? today.add(this.settings.maxDays, "days") : null;
				const maxEvents = this.settings.maxEvents;

				// Processing the parsed events
				Object.entries(data).forEach(([key, item]) => {
					if (item.type == "VEVENT") {
						const startDate = this.convertEventDate(item.start);

						let endDate;
						if (item.end)
							endDate = this.convertEventDate(item.end);
						else if (item.duration)
							endDate = startDate.add(moment.duration(item.duration));

						if (!endDate || now.isAfter(endDate)) return;

						const duration = endDate.diff(startDate);
						const isDayEvent = item.start.length == 8 || (duration >= 86400 * 1000 && startDate.hour() == 0 && startDate.minute() == 0);

						const event = {
							startDate,
							endDate,
							isDayEvent,
							duration,
							title: item.summary || item.description,
							description: item.description,
							location: item.location,
						};


						// TODO: generate recurring events with https://github.com/jakubroztocil/rrule




						events.push(event);
					}
				});

				// Ordering
				events.sort((a, b) => a.startDate - b.startDate);

				// Limiting
				if (maxEvents && events.length > maxEvents)
					events.length = maxEvents;

				writeToTemp(`calendar-events-${opts.name}`, events);

				this.result[opts.name] = {
					...opts,
					events
				};
			} catch(err) {
				this.logger.error(`Unable to refresh the '${opts.name}' calendar.`, err);
			}

		},

		async fetchInfo(url) {
			const res = await fetch(url);
			return await res.text();
		}
	},

	created() {
		this.timer = null;

		this.result = {};
	},

	async started() {
		this.timer = setInterval(
			() => this.refresh(),
			(this.settings.refreshMin || 10) * 60 * 1000
		);

		this.refresh();
	},

	async stopped() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
};
