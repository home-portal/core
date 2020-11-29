const _ = require("lodash");
const fetch = require("node-fetch");
const moment = require("moment");
const Moleculer = require("moleculer");
const { writeToTemp } = require("../../../backend/utils");
const ical = require("node-ical");
const { RRule } = require("rrule");

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
			if (Array.isArray(this.settings.calendars)) {
				await Promise.all(this.settings.calendars.map(async opts => {
					const events = await this.collectCalendarEvents(opts);

					this.result[opts.name] = {
						...opts,
						events
					};

					if (events == null) return;

					this.broker.call("current.update", {
						key: "events",
						subKey: opts.name,
						payload: this.result[opts.name]
					});
				}));
			}
		},

		convertEventDate(v) {
			return moment(new Date(v));
		},

		async collectCalendarEvents(opts) {
			this.logger.info(`Refreshing calendar '${opts.name}'...`);
			try {
				// const response = await this.fetchInfo(opts.url);
				// writeToTemp(`calendar-response-${opts.name}`, response);
				// const data = ical.parseICS(response);
				const data = await ical.async.fromURL(opts.url);

				writeToTemp(`calendar-parsed-${opts.name}`, data);

				const events = [];

				const now = moment();
				const today = moment().startOf("day");
				const maxDay = today.clone().add(this.settings.maxDays || 365, "days");
				const maxEvents = this.settings.maxEvents;

				// Processing the parsed events
				Object.entries(data).forEach(([key, item]) => {
					if (item.type == "VEVENT") {
						const startDate = this.convertEventDate(item.start);

						let endDate;
						if (item.end) endDate = this.convertEventDate(item.end);
						else if (item.duration)
							endDate = startDate.clone().add(moment.duration(item.duration));
						if (!endDate) return;

						const duration = endDate.diff(startDate);
						const isDayEvent =
							item.start.length == 8 || item.datetype == "date" ||
							(duration >= 86400 * 1000 &&
								startDate.hour() == 0 &&
								startDate.minute() == 0);

						const event = {
							id: key,
							startDate: startDate.valueOf(),
							endDate: endDate.valueOf(),
							isDayEvent,
							duration,
							title: item.summary || item.description,
							description: item.description,
							location: item.location
						};

						// Generate recurring events
						if (item.rrule && item.rrule.options) {
							// Recurrence event
							const ruleOpts = item.rrule.options;
							if (!ruleOpts.until && ruleOpts.count == null) ruleOpts.until = maxDay.toDate();
							else if (ruleOpts.until && moment(ruleOpts.until).isAfter(maxDay)) ruleOpts.until = maxDay.toDate();
							else if (ruleOpts.until && moment(ruleOpts.until).isBefore(today)) return;

							if (!ruleOpts.dtstart)
								ruleOpts.dtstart = today.toDate();

							const rule = new RRule(ruleOpts);
							rule.all().forEach(e => {
								const startDate = moment(e);
								const endDate = startDate.clone().add(event.duration);

								if (now.isAfter(endDate) || endDate.isAfter(maxDay)) return;

								events.push({
									...event,
									startDate: startDate.valueOf(),
									endDate: endDate.valueOf(),
								});
							});
						} else {
							// Single event
							if (now.isAfter(endDate) || endDate.isAfter(maxDay)) return;

							events.push(event);
						}
					}
				});

				// Ordering
				events.sort((a, b) => a.startDate - b.startDate);

				// Limiting
				if (maxEvents && events.length > maxEvents) events.length = maxEvents;

				writeToTemp(`calendar-events-${opts.name}`, events);

				return events;

			} catch (err) {
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
