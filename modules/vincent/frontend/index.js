import FloorPage from "./FloorPage.vue";

HomePortal.registerPage({
	name: "vincent-floor",
	module: "vincent",
	showInQuickLaunch: true,
	caption: "Home Sensors",
	icon: "fa fa-thermometer-empty",
	mountDiv: el => {
		return HomePortal.createModuleApp(FloorPage).mount(el).$el;
	}
});
