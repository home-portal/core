import TrafficPage from "./TrafficPage.vue";

HomePortal.registerPage({
	name: "traffic",
	module: "ui-traffic",
	showInQuickLaunch: true,
	caption: "Traffic Map",
	icon: "fa fa-globe-americas",
	mountDiv: el => {
		return HomePortal.createModuleApp(TrafficPage).mount(el).$el;
	}
});
