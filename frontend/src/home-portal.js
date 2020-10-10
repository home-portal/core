import vue from "vue";
import _ from "lodash";
import moment from "moment";
import { gsap } from "gsap";
import react from "react";
import reactDOM from "react-dom";

moment.locale(window.navigator.userLanguage || window.navigator.language);

class HomePortal {
	constructor() {
		this.settings = {};
		this.modules = {};
		this.pages = {};
		this.widgets = {};
		this.dependencies = {
			vue,
			lodash: _,
			moment,
			gsap,
			react,
			reactDOM
		};

		this.activePage = null;
	}

	async init() {
		this.broker = window.broker;
		const self = this;

		this.broker.createService({
			name: "$router",
			actions: {
				goTo(ctx) {
					if (ctx.params.page) {
						self.goToPage(ctx.params.page);
					}
				},

				goHome(ctx) {
					self.goHome();
				}
			}
		});

		this.updateBootStatus("Starting");
		await this.broker.start();

		this.updateBootStatus("Load configuration");
		await this.downloadConfig();

		this.updateBootStatus("Loading modules");
		await this.loadModules();

		this.updateBootStatus("All modules loaded");

		this.goHome();

		this.restartScreenSaverTimer();

		document.addEventListener("click", () => this.restartIdleTimer());
		document.addEventListener("touch", () => this.restartIdleTimer());
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
		await this.broker.waitForServices("modules");
		const modules = await this.broker.call("modules.all");
		for (const module of Object.values(modules)) {
			await this.registerModule(module);
		}
		console.log("Modules", this.modules);
	}

	async registerModule(module) {
		try {
			this.modules[module.name] = module;
			module.settings = _.defaultsDeep(
				{},
				this.settings.modules[module.name],
				module.config.defaultSettings
			);
			await this.broker.emit("boot.status", { status: `Loading '${module.name}' module` });
			const files =
				module.config && module.config.frontend ? module.config.frontend.files : null;
			if (files && files.length > 0) {
				for (const f of files) {
					if (f.endsWith(".css"))
						await this.loadStyleFile(`/modules/${module.name}/${f}`);
					else if (f.endsWith(".js"))
						await this.loadScriptFile(`/modules/${module.name}/${f}`);
					else {
						console.log("Unknown file format:", f);
					}
				}
			}
		} catch (err) {
			console.error("Unable to load module", err, module);
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

	getPage(name) {
		return this.pages[name];
	}

	getModuleSettings(name) {
		const module = this.getModule(name);
		if (!module) throw new Error(`Module '${name}' not found.`);

		return module.settings;
	}

	registerPage(opts) {
		const module = this.getModule(opts.module);
		if (!module) throw new Error(`Module '${opts.module}' not found.`);

		const page = { ...opts };
		page.module = module;

		this.pages[page.name] = page;

		console.log(`Page '${page.name}' registered.`, page);

		return page;
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

	goHome() {
		const homePage = this.settings.homePage?.page;
		if (!homePage) {
			return console.warn("Homepage is not defined.");
		}

		this.goToPage(homePage);
	}

	async goToPage(name) {
		const nextPage = this.getPage(name);
		if (!nextPage) throw new Error(`Page '${name}' not found.`);

		if (this.activePage && this.activePage.name == name) return;

		const rootContainer = document.querySelector("#modules");

		if (this.activePage) {
			if (this.activePage.content) {
				if (this.animationEnabled()) {
					await gsap.to(this.activePage.content, {
						x: "+100vw",
						duration: 0.5,
						display: "none",
						ease: "Power3.easeIn"
					});
				} else {
					this.activePage.content.style.display = "none";
				}
				this.activePage.content.classList.remove("active");
				rootContainer.removeChild(this.activePage.content);
			}
			await this.broker.broadcast(`page-${this.activePage.name}.deactivated`);
		}

		if (!nextPage.content) {
			if (_.isFunction(nextPage.mountDiv)) {
				const div = document.createElement("div");
				rootContainer.appendChild(div);
				nextPage.content = nextPage.mountDiv(div);
			} else if (_.isFunction(nextPage.mount)) {
				nextPage.content = nextPage.mount(rootContainer);
			} else {
				console.warn(
					`No 'mount' or 'mountDiv' method in page '${nextPage.name}'`,
					nextPage
				);
			}
		}

		if (nextPage.content) {
			rootContainer.appendChild(nextPage.content);
			if (this.animationEnabled()) {
				await gsap.fromTo(
					nextPage.content,
					{ x: "-100vw" },
					{ x: 0, duration: 0.5, display: "block", ease: "Power3.easeOut" }
				);
			} else {
				nextPage.content.style.display = "block";
			}
			nextPage.content.classList.add("active");
			await this.broker.broadcast(`page-${nextPage.name}.activated`);
			this.activePage = nextPage;
		} else {
			console.warn(`No content of the '${nextPage.name}' page.`, nextPage);
		}

		const homePage = this.settings.homePage?.page;
		if (name != homePage) this.restartIdleTimer();
	}

	animationEnabled() {
		return !!this.settings.animation;
	}

	restartScreenSaverTimer() {
		const time = this.settings.screenSaver?.time;
		if (time > 0) {
			console.log("Restart screen saver timer...", time);
			if (this.screenSaverTimer) {
				clearTimeout(this.screenSaverTimer);
			}

			this.screenSaverTimer = setTimeout(() => {
				clearTimeout(this.screenSaverTimer);
				this.screenSaverTimer = null;
				this.startScreenSaver();
			}, time * 1000);
		}
	}

	startScreenSaver() {
		const page = this.settings.screenSaver?.page;
		if (page) {
			this.goToPage(page);
		}
	}

	restartIdleTimer() {
		const time = this.settings.homePage?.idleTime;
		if (time > 0) {
			console.log("Restart ide timer...", time);
			if (this.idleTimer) {
				clearTimeout(this.idleTimer);
			}

			this.idleTimer = setTimeout(() => {
				clearTimeout(this.idleTimer);
				this.idleTimer = null;
				this.idleTimeTick();
			}, time * 1000);
		}

		this.restartScreenSaverTimer();
	}

	idleTimeTick() {
		this.broker.call("$router.goHome");
	}
}

window.HomePortal = new HomePortal();

export default window.HomePortal;
