import Widget from "./widgets/CalendarWidget.vue";

HomePortal.registerWidget({
	name: "events",
	module: "ui-events",
	mountDiv: el => {
		return HomePortal.createModuleApp(Widget).mount(el).$el;
	}
});
/*
import Page from "./CalendarPage.vue";

HomePortal.registerPage({
	name: "events",
	module: "ui-events",
	showInQuickLaunch: true,
	caption: "Calendar",
	icon: "fa fa-calendar-alt",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(Page).mount(el).$el;
	}
});
*/
