import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import Widget from "./widgets/CalendarWidget.vue";

HomePortal.registerWidget({
	name: "calendar-google",
	module: "calendar-google",
	mountDiv: el => new Vue({ render: h => h(Widget) }).$mount(el).$el
});

import Page from "./CalendarPage.vue";

HomePortal.registerPage({
	name: "calendar-google",
	module: "calendar-google",
	showInQuickLaunch: true,
	caption: "Calendar",
	icon: "fa fa-calendar-alt",
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
