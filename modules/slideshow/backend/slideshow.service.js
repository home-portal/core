// const { existsSync } = require("fs");
// const fs = require("fs").promises;
const path = require("path");
const _ = require("lodash");
const globby = require("globby");

const Moleculer = require("moleculer");

module.exports = {
	name: "slideshow",
	mixins: [Moleculer.Mixins.ModuleSettingsMixin, Moleculer.Mixins.ModuleConfigMixin],

	actions: {
		async getImages() {
			const files = await globby(this.settings.scanning.folder + "/**/*.+(jpg|jpeg|png|gif|JPG)", {
				// https://github.com/mrmlnc/fast-glob#options-3
				cwd: path.resolve(this.config.dataFolder),
				deep: this.settings.scanning && !this.settings.scanning.subFolders ? 1 : undefined,
				onlyFiles: true,
				extglob: true
			});

			return files;
		}
	}
};
