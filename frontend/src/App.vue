<template>
	<div id="app">
		<div id="modules"></div>
		<boot-screen v-if="!ready" ref="bootScreen"></boot-screen>
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
		}
	},

	async mounted() {
		try {
			await window.HomePortal.init();
			this.ready = true;
		} catch (err) {
			this.updateBootStatus("Error: " + err.message, true);
		}
	}
};
</script>
