import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import Widget from "./widgets/CalendarWidget.vue";

HomePortal.registerWidget({
	name: "events",
	module: "ui-events",
	mountDiv: el => new Vue({ render: h => h(Widget) }).$mount(el).$el
});
/*
import Page from "./CalendarPage.vue";

HomePortal.registerPage({
	name: "events",
	module: "ui-events",
	showInQuickLaunch: true,
	caption: "Calendar",
	icon: "fa fa-calendar-alt",
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
*/
