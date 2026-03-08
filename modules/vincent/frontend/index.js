import FloorPage from "./FloorPage.vue";

HomePortal.registerPage({
	name: "vincent-floor",
	module: "vincent",
	showInQuickLaunch: true,
	caption: "Home Sensors",
	icon: "fa fa-thermometer-empty",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(FloorPage).mount(el).$el;
	}
});
