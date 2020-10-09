const { existsSync, createWriteStream } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const url = require("url");
const _ = require("lodash");
const { makeDirs } = require("moleculer").Utils;
const globby = require("globby");
//const yaml = require("js-yaml");

const fetch = require("node-fetch");
const Moleculer = require("moleculer");
const { stopped } = require("../../../backend/services/modules.service");

const BASE_URL = "http://api.flickr.com/services/feeds/photos_public.gne";

module.exports = {
	name: "flickr",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin],

	actions: {
		scanFlickrPhotos() {
			return this.scanFlickrPhotos();
		}
	},

	methods: {
		async scanFlickrPhotos() {
			if (this.settings.userIDs && this.settings.userIDs.length > 0) {
				this.logger.info("Scanning Flickr photos...");
				for (const userID of this.settings.userIDs) {
					await this.scanFlickerUserPhotos(userID);
				}
				if (this.downloadQueue.length)
					this.logger.info("Queued items:", this.downloadQueue.length);
			}
		},

		async scanFlickerUserPhotos(userID) {
			this.logger.info(`Scanning photos of Flickr user...`, { userID });
			try {
				const userFolder = path.resolve(this.settings.folder, userID);
				makeDirs(userFolder);

				const res = await fetch(
					`${BASE_URL}?id=${userID}&size=b&lang=en-us&format=json&jsoncallback=?`
				);
				const str = await res.text();
				const data = JSON.parse(str.substring(1, str.length - 1));

				// this.logger.info("data", data);

				if (data && data.items) {
					data.items.forEach(item => {
						const imageURL = item.media.m.replace("_m.jpg", "_b.jpg");
						const parsedURL = url.parse(imageURL);
						const localFile = path.join(userFolder, path.basename(parsedURL.pathname));
						if (!existsSync(localFile)) {
							this.downloadQueue.push({
								userID: userID,
								localFile,
								url: imageURL
							});
						}
					});
				}
			} catch (err) {
				this.logger.error("Unable to scan user photos", err, { userID });
			}
		},

		async downloadQueuedImages() {
			if (this.downloading || this.downloadQueue.length == 0) return;

			this.downloading = true;
			let count = 0;
			try {
				this.logger.info("Downloading images from queue...", { count: this.downloadQueue.length });
				while (this.downloadQueue.length > 0 && count < 100) {
					const item = this.downloadQueue.shift();

					const res = await fetch(item.url);
					const fileStream = createWriteStream(item.localFile);
					await new this.Promise((resolve, reject) => {
						res.body.pipe(fileStream);
						res.body.on("error", reject);
						fileStream.on("finish", resolve);
					});
					this.logger.info("Flickr image downloaded.", item);
					await this.Promise.delay(1000);
				}
			} catch (err) {
				this.logger.warn("Unable to download images.", err);
			}
			this.downloading = false;
		}
	},

	created() {
		this.scanTimer = null;
		this.downloadTimer = null;
		this.downloadQueue = [];
		this.downloading = false;
	},

	started() {
		this.scanFlickrPhotos();

		this.downloadTimer = setInterval(() => this.downloadQueuedImages(), 60 * 1000);

		const scanMins = this.settings.scanMins || 8 * 60; // 8 hours
		if (scanMins > 0)
			this.scanTimer = setInterval(() => this.scanFlickrPhotos(), scanMins * 60 * 1000);
	},

	stopped() {
		if (this.scanTimer) {
			clearInterval(this.scanTimer);
		}

		if (this.downloadTimer) {
			clearInterval(this.downloadTimer);
		}

		this.downloadQueue = [];
	}
};
