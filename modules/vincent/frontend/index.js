const Vue = HomePortal.dependencies.vue;

import FloorPage from "./FloorPage.vue";

HomePortal.registerPage({
	name: "vincent-floor",
	module: "vincent",
	showInQuickLaunch: true,
	caption: "Home Sensors",
	icon: "fa fa-thermometer-empty",
	mountDiv: el => new Vue({ render: h => h(FloorPage) }).$mount(el).$el
});
