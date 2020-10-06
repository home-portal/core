import vue from "vue";
import lodash from "lodash";
import moment from "moment";
import { gsap } from "gsap";

moment.locale(window.navigator.userLanguage || window.navigator.language);

class HomePortal {
	constructor() {
		this.modules = {};
		this.dependencies = {
			vue,
			lodash,
			moment,
			gsap
		};
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

	createPage(name, contentEl) {
		const div = document.createElement("div");
		div.id = `module-${name}`;

		if (contentEl) {
			div.appendChild(contentEl);
		}
		document.querySelector("#modules").appendChild(div);

		return div;
	}

	createService(schema) {
		return this.broker.createService(schema);
	}

	async goToPage(name) {
		let activeModule = document.querySelector("#modules > div.active");
		if (activeModule) {
			const name = activeModule.id.substring(7);
			await this.broker.broadcast(`module-${name}.deactivated`);
			await gsap.to(activeModule.querySelector(".page"), { x: "-100vw", duration: .5, display: "none", ease: "Power3.easeIn" });
			activeModule.classList.remove("active");
		}

		activeModule = document.querySelector(`#modules > #module-${name}`);
		await gsap.fromTo(activeModule.querySelector(".page"), { x: "-100vw" } , { x: 0, duration: .5, display:'block', ease: "Power3.easeOut" });
		activeModule.classList.add("active");
		await this.broker.broadcast(`module-${name}.activated`);
	}
}

window.HomePortal = new HomePortal();

export default window.HomePortal;
