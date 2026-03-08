import ClockWidget from "./widgets/ClockWidget.vue";
import Page from "./ClockPage.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		createApp(ClockWidget).mount(el);
	}
});

HomePortal.registerPage({
	name: "clock",
	module: "ui-clock",
	persistent: true,
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(Page).mount(el).$el;
	}
});
