const Vue = HomePortal.dependencies.vue;

import TrafficPage from "./TrafficPage.vue";

HomePortal.registerPage({
	name: "traffic",
	module: "ui-traffic",
	showInQuickLaunch: true,
	caption: "Traffic Map",
	icon: "fa fa-globe-americas",
	mountDiv: el => new Vue({ render: h => h(TrafficPage) }).$mount(el).$el
});
