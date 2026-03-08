import TrafficPage from "./TrafficPage.vue";

HomePortal.registerPage({
	name: "traffic",
	module: "ui-traffic",
	showInQuickLaunch: true,
	caption: "Traffic Map",
	icon: "fa fa-globe-americas",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(TrafficPage).mount(el).$el;
	}
});
