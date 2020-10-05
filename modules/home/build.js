const Bundler = require("parcel-bundler");
const Path = require("path");

// Single entrypoint file location:
const entryFiles = Path.join(__dirname, "frontend", "index.js");
// OR: Multiple files with globbing (can also be .js)
// const entryFiles = './src/*.js';
// OR: Multiple files in an array
// const entryFiles = ['./src/index.html', './some/other/directory/scripts.js'];

// Bundler options
const options = {
	outDir: Path.join(__dirname, "..", "..", "frontend", "public", "modules", "home"), // The out directory to put the build files in, defaults to dist
	outFile: "index.js", // The name of the outputFile
	outputFormat: "commonjs",
	isLibrary: true,
	publicUrl: "./", // The url to serve on, defaults to '/'
	watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
	cache: false, // Enabled or disables caching, defaults to true
	cacheDir: ".cache", // The directory cache gets put in, defaults to .cache
	contentHash: false, // Disable content hash from being included on the filename
	//global: "HomeModule", // Expose modules as UMD under this name, disabled by default
	minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
	scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
	target: "browser", // Browser/node/electron, defaults to browser
	bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
	sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
	autoInstall: true // Enable or disable auto install of missing dependencies found during bundling
};

(async function () {
	// Initializes a bundler using the entrypoint location and options provided
	const bundler = new Bundler(entryFiles, options);

	// Run the bundler, this returns the main bundle
	// Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
	await bundler.bundle();
})();
