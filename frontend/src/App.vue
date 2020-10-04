<template>
	<div id="app">
		<boot-screen v-if="!ready" ref="bootScreen"></boot-screen>
		<template v-else>
			<keep-alive>
				<router-view />
			</keep-alive>
		</template>
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
			if (this.$refs.bootScreen)
				this.$refs.bootScreen.updateStatus(text, isError);
		},

		async startBroker() {
			this.updateBootStatus("Starting");
			await this.broker.start();

		},

		async downloadConfig() {
			this.updateBootStatus("Load configuration");
			const config = await this.broker.call("config.get");
			console.log("Configuration", config);
		},

		async loadModules() {
			this.updateBootStatus("Loading modules");
			const modules = await this.broker.call("init.modules");
			console.log("Modules", config);
		}

	},

	async mounted() {
		try {
			await this.startBroker();
			await this.downloadConfig();
			this.ready = true;
		} catch(err) {
			this.updateBootStatus("Error: " + err.message, true);
		}
	}
};
</script>
