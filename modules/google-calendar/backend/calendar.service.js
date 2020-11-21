const fetch = require("node-fetch");
const Moleculer = require("moleculer");

const { existsSync } = require("fs");
const fs = require("fs").promises;
const { google } = require("googleapis");

module.exports = {
	name: "google-calendar",
	mixins: [/*Moleculer.Mixins.ModuleSettingsMixin, */Moleculer.Mixins.ModuleConfigMixin],

	settings: {
		rest: "/google-calendar/",

		tokenFile: "./data/google-calendar/token.json",
		secretFile: "./data/google-calendar/credentials.json",
		scopes: ["https://www.googleapis.com/auth/calendar.readonly"]
	},

	actions: {
		getEvents() {
			return this.result;
		},

		refresh() {
			return this.refresh();
		},

		oAuthCallback: {
			rest: "/oauth-callback",
			async handler(ctx) {
				const token = await new Promise((resolve, reject) => {
					this.oAuth2Client.getToken(ctx.params.code, (err, token) => {
						if (err) return reject(err);
						return resolve(token);
					});
				});
				this.oAuth2Client.setCredentials(token);
				await this.storeToken(token);

				this.authUrl = null;
				this.waitForAuthenticate = false;
				this.ready = true;

				this.refresh(); // No await


				ctx.meta.$statusCode = 302;
				ctx.meta.$location = "http://localhost:4000"; // TODO
			}
		}
	},

	methods: {
		async init() {
			if (!existsSync(this.settings.secretFile)) {
				this.logger.warn(
					`There is not credentials file. Go to Google API console and enable Google Calendar API. Download the credentials and copy to '${this.settings.secretFile}'.`
				);
				return;
			}
			try {
				// Read credentials file
				const credentials = await fs.readFile(this.settings.secretFile, "utf8");
				this.ready = await this.authorize(JSON.parse(credentials));
			} catch (err) {
				this.logger.error("Unable to init calendar module.", err);
			}
		},

		async authorize(credentials) {
			const { client_secret, client_id, redirect_uris } = credentials.web;
			const redirectUrl = redirect_uris[0]; // `http://localhost:${this.config.httpPort}/api/google-calendar/oauth-callback`;

			this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUrl);

			try {
				// Check if we have previously stored a token.
				const token = await fs.readFile(this.settings.tokenFile);
				this.oAuth2Client.setCredentials(JSON.parse(token));
				this.authUrl = null;
				this.waitForAuthenticate = false;
			} catch (err) {
				this.authUrl = this.oAuth2Client.generateAuthUrl({
					access_type: "offline",
					scope: this.settings.scopes
				});

				this.logger.info("Authorize this app by visiting this url:", this.authUrl);
			}
			return !this.authUrl;
		},

		async storeToken(token) {
			try {
				await fs.writeFile(this.settings.tokenFile, JSON.stringify(token));
				this.logger.info(
					`Google Calendar auth token saved to '${this.settings.tokenFile}'.`
				);
			} catch (err) {
				this.logger.warn("Unable to save Google Calendar token.", err);
			}
		},

		async refresh() {
			if (!this.ready) return;

			this.logger.info("Downloading calendar events...");

			this.result.events = await this.downloadCalendarEvents();

			this.result.updatedAt = Date.now();

			this.logger.info("Calendar event downloaded.", this.result);

			this.broker.broadcast("calendar.events.updated", this.result);
		},

		async downloadCalendarEvents() {
			return new Promise((resolve, reject) => {
				const calendar = google.calendar({ version: "v3", auth: this.oAuth2Client });
				calendar.events.list(
					{
						calendarId: "primary",
						timeMin: new Date().toISOString(),
						maxResults: 10,
						singleEvents: true,
						orderBy: "startTime"
					},
					(err, res) => {
						if (err) {
							this.logger.error("The Google Calendar API returned an error: ", err);
							return reject(err);
						}

						return resolve(res.data.items);
					}
				);
			});
		}
	},

	created() {
		this.waitForAuth = false;
		this.authUrl = null;
		this.ready = false;

		this.timer = null;

		this.result = {};
	},

	async started() {
		await this.init();

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
