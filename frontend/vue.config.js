module.exports = {
	// More info: https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/options.js
	outputDir: "../public",
	assetsDir: undefined,
	productionSourceMap: false,
	lintOnSave: false,
	filenameHashing: false,

	devServer: {
		proxy: {
			"/media": { target: "http://localhost:4000" }
		}
	}

	// configureWebpack: config => {},
};
