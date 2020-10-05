<template>
	<div id="app">
		<boot-screen v-if="!ready" ref="bootScreen"></boot-screen>
		<template v-else>
			<!-- <keep-alive>
				<router-view />
			</keep-alive> -->
		</template>
		<div id="modules"></div>
	</div>
</template>

<script>
import BootScreen from "./views/Boot";
export default {
	components: {
		BootScreen
	},
	data() {
		return {
			ready: false
		};
	},

	events: {
		"boot.status"(ctx) {
			if (ctx.params.status) {
				this.updateBootStatus(String(ctx.params.status).trim());
			}
		}
	},

	methods: {
		updateBootStatus(text, isError) {
			if (this.$refs.bootScreen) this.$refs.bootScreen.updateStatus(text, isError);
		},

		async startBroker() {
			this.updateBootStatus("Starting");
			await this.broker.start();
		},

		async downloadConfig() {
			this.updateBootStatus("Load configuration");
			await this.broker.waitForServices("config");
			const config = await this.broker.call("config.get");
			console.log("Configuration", config);
		},

		async loadModules() {
			this.updateBootStatus("Loading modules");
			await this.broker.waitForServices("init");
			const modules = await this.broker.call("init.modules");
			console.log("Modules", modules);

			const container = document.querySelector("#modules");

			Object.values(modules).forEach(async module => {
				const div = document.createElement("div");
				div.id = `module-${module.name}`;
				container.appendChild(div);

				const style = document.createElement("link");
				style.href = "/modules/home/index.css";
				style.type = "text/css";
				style.rel = "stylesheet";
				style.onload = function() {
					console.log(`Style for ${module.name} module loaded and ready`);
				};
				document.querySelector("head").appendChild(style);

				await new Promise((resolve, reject) => {
				const script = document.createElement("script");
				//script.type= "module";
				script.onload = function(event) {
					console.log(`Script for ${module.name} module loaded and ready`, this, event, script.toString());
					resolve();
				};
    			script.onerror = reject;
				script.src = "/modules/home/index.js";
				document.querySelector("body").appendChild(script);
				});
			});
		}
	},

	async mounted() {
		try {
			await this.startBroker();
			await this.downloadConfig();
			await this.loadModules();
			this.ready = true;
		} catch (err) {
			this.updateBootStatus("Error: " + err.message, true);
		}
	}
};
</script>
