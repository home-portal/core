import ClockWidget from "./widgets/ClockWidget.vue";
import Page from "./ClockPage.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => {
		HomePortal.createModuleApp(ClockWidget).mount(el);
	}
});

HomePortal.registerPage({
	name: "clock",
	module: "ui-clock",
	persistent: true,
	mountDiv: el => {
		return HomePortal.createModuleApp(Page).mount(el).$el;
	}
});
