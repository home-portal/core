import vue from "vue";

class HomePortal {
	constructor() {
		this.modules = {};
		this.dependencies = {
			vue
		}
	}

	async init() {
		this.broker = window.broker;

		this.updateBootStatus("Starting");
		await this.broker.start();

		this.updateBootStatus("Load configuration");
		await this.downloadConfig();

		this.updateBootStatus("Loading modules");
		await this.loadModules();

		this.updateBootStatus(`All modules loaded`);
	}

	async updateBootStatus(status) {
		await this.broker.emit("boot.status", { status });
	}

	async startBroker() {
		this.updateBootStatus("Starting");
		await this.broker.start();
	}

	async downloadConfig() {
		await this.broker.waitForServices("config");
		const config = await this.broker.call("config.get");
		console.log("Configuration", config);
	}

	async loadModules() {
		await this.broker.waitForServices("init");
		const modules = await this.broker.call("init.modules");
		console.log("Modules", modules);

		await Promise.all(
			Object.values(modules).map(async module => {
				await this.registerModule(module);
				this.modules[module.name] = module;
			})
		);
	}

	async registerModule(module) {
		await this.broker.emit("boot.status", { status: `Loading '${module.name}' module` });
		await new Promise((resolve, reject) => {
			const style = document.createElement("link");
			style.href = "/modules/home/index.css";
			style.type = "text/css";
			style.rel = "stylesheet";
			style.onload = function() {
				console.log(`Style for ${module.name} module loaded and ready`);
				resolve();
			};
			style.onerror = reject;
			document.querySelector("head").appendChild(style);
		});

		await new Promise((resolve, reject) => {
			const script = document.createElement("script");
			//script.type= "module";
			script.onload = function(event) {
				console.log(
					`Script for ${module.name} module loaded and ready`,
					this,
					event,
					script.toString()
				);
				resolve();
			};
			script.onerror = reject;
			script.src = "/modules/home/index.js";
			document.querySelector("body").appendChild(script);
		});
	}

	getModule(name) {
		return this.modules[name];
	}

	createPage(name, contentEl) {
		const div = document.createElement("div");
		div.id = `module-${name}`;

		if (contentEl) {
			div.appendChild(contentEl);
		}
		document.querySelector("#modules").appendChild(div);

		return div;
	}
}

window.HomePortal = new HomePortal();

export default window.HomePortal;
