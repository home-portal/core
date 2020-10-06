import vue from "vue";
import lodash from "lodash";
import moment from "moment";
import { gsap } from "gsap";

moment.locale(window.navigator.userLanguage || window.navigator.language);

class HomePortal {
	constructor() {
		this.settings = {};
		this.modules = {};
		this.widgets = {};
		this.dependencies = {
			vue,
			lodash,
			moment,
			gsap
		};

		this.activeModule = null;
	}

	async init() {
		this.broker = window.broker;
		const self = this;

		this.broker.createService({
			name: "$router",
			actions: {
				"goTo"(ctx) {
					if (ctx.params.page) {
						self.goToPage(ctx.params.page);
					}
				},

				"goHome"(ctx) {
					self.goToPage("home");
				}
			}
		})

		this.updateBootStatus("Starting");
		await this.broker.start();

		this.updateBootStatus("Load configuration");
		await this.downloadConfig();

		this.updateBootStatus("Loading modules");
		await this.loadModules();

		this.updateBootStatus(`All modules loaded`);

		this.goToPage("home");
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
		this.settings = await this.broker.call("config.get");
		console.log("Full settings", this.settings);
	}

	async loadModules() {
		await this.broker.waitForServices("init");
		const modules = await this.broker.call("init.modules");
		await Promise.all(Object.values(modules).map(module => this.registerModule(module)));
		console.log("Modules", this.modules);
	}

	async registerModule(module) {
		this.modules[module.name] = module;
		module.settings = _.defaultsDeep({}, this.settings.modules[module.name], module.config.defaultSettings);
		await this.broker.emit("boot.status", { status: `Loading '${module.name}' module` });
		const files = module.config && module.config.frontend ? module.config.frontend.files : null;
		if (files && files.length > 0) {
			for (const f of files) {
				if (f.endsWith(".css")) await this.loadStyleFile(`/modules/${module.name}/${f}`);
				else if (f.endsWith(".js"))
					await this.loadScriptFile(`/modules/${module.name}/${f}`);
				else {
					console.log("Unknown file format:", f);
				}
			}
		}
	}

	async loadStyleFile(url) {
		await new Promise((resolve, reject) => {
			const style = document.createElement("link");
			style.href = url;
			style.type = "text/css";
			style.rel = "stylesheet";
			style.onload = resolve;
			style.onerror = reject;

			document.querySelector("head").appendChild(style);
		});
	}

	async loadScriptFile(url) {
		await new Promise((resolve, reject) => {
			const script = document.createElement("script");
			//script.type= "module";
			script.onload = resolve;
			script.onerror = reject;
			script.src = url;
			document.querySelector("body").appendChild(script);
		});
	}

	getModule(name) {
		return this.modules[name];
	}

	getModuleSettings(name) {
		const module = this.getModule(name);
		if (!module) throw new Error(`Module '${opts.module}' not found.`);

		return module.settings;
	}

	registerPage(opts) {
		const module = this.getModule(opts.module);
		if (!module) throw new Error(`Module '${opts.module}' not found.`);

		module.el = opts.content;
		return module;
	}

	registerWidget(opts) {
		this.widgets[opts.name] = opts;
		console.log(`Widget '${opts.name}' registered.`, opts);
	}

	getWidget(name) {
		return this.widgets[name];
	}

	createService(schema) {
		return this.broker.createService(schema);
	}

	async goToPage(name) {
		const newModule = this.getModule(name);
		if (!newModule) throw new Error(`Module '${moduleName}' not found.`);

		if (this.activeModule) {
			if (this.activeModule.el) {
				await gsap.to(this.activeModule.el, { x: "+100vw", duration: .5, display: "none", ease: "Power3.easeIn" });
				this.activeModule.el.classList.remove("active");
				document.querySelector("#modules").removeChild(this.activeModule.el);
			}
			await this.broker.broadcast(`module-${this.activeModule.name}.deactivated`);
		}

		if (newModule.el) {
			document.querySelector("#modules").appendChild(newModule.el);
			await gsap.fromTo(newModule.el, { x: "-100vw" } , { x: 0, duration: .5, display:'block', ease: "Power3.easeOut" });
			newModule.el.classList.add("active");
		}
		await this.broker.broadcast(`module-${newModule.name}.activated`);
		this.activeModule = newModule;
	}
}

window.HomePortal = new HomePortal();

export default window.HomePortal;
