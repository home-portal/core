const Path = require("path");
const fs = require("fs");

// Use vite and vue plugin from the frontend's node_modules since they are installed there
const FRONTEND_DIR = Path.join(__dirname, "..", "frontend");
const VITE_RESOLVE_PATHS = [FRONTEND_DIR];

const mode = process.argv[2];
const moduleName = process.argv[3];
if (!moduleName) throw new Error("Module name is missing");

const modules = [];
if (moduleName === "all") {
	const dirs = fs.readdirSync(__dirname, { withFileTypes: true })
		.filter(d => d.isDirectory())
		.map(d => d.name);
	modules.push(...dirs);
} else {
	modules.push(moduleName);
}

async function bundleModule(name) {
	let entry = Path.join(__dirname, name, "frontend", "index.js");
	if (!fs.existsSync(entry)) {
		if (fs.existsSync(entry + "x")) {
			entry += "x";
		} else {
			if (moduleName === "all") {
				console.log(`No frontend entry point, '${name}' skipped.`);
				return;
			} else {
				throw new Error("Entry file not found: " + entry);
			}
		}
	}

	const vitePath = require.resolve("vite", { paths: VITE_RESOLVE_PATHS });
	const vuePath = require.resolve("@vitejs/plugin-vue", { paths: VITE_RESOLVE_PATHS });
	const { build } = await import(vitePath);
	const { default: vue } = await import(vuePath);

	const outDir = Path.join(__dirname, "..", "frontend", "public", "modules", name);

	await build({
		configFile: false,
		root: Path.join(__dirname, name, "frontend"),
		plugins: [vue()],
		build: {
			lib: {
				entry,
				formats: ["iife"],
				name: `HomeModule_${name.replace(/-/g, "_")}`,
				fileName: () => "index.js",
				cssFileName: "style",
			},
			outDir,
			emptyOutDir: false,
			sourcemap: true,
			minify: true,
			rollupOptions: {
				external: ["vue"],
				output: {
					assetFileNames: "[name].[ext]",
					globals: {
						vue: "HomePortal.dependencies.vue"
					}
				}
			}
		},
		resolve: {
			extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
		},
		define: {
			"process.env.NODE_ENV": JSON.stringify("production"),
			"__VUE_OPTIONS_API__": true,
			"__VUE_PROD_DEVTOOLS__": false,
			"__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": false
		},
		logLevel: "warn"
	});

	// Rename Vite's default style.css to index.css
	const styleCss = Path.join(outDir, "style.css");
	const indexCss = Path.join(outDir, "index.css");
	if (fs.existsSync(styleCss)) {
		fs.renameSync(styleCss, indexCss);
	}

	console.log(`Built: ${name}`);
}

(async () => {
	console.log("Building modules:", modules.join(", "));
	for (const name of modules) {
		await bundleModule(name);
	}
	console.log("All done!");
})();
