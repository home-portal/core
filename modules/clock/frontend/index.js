const Vue = HomePortal.dependencies.vue;

import ClockWidget from "./widgets/ClockWidget.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => new Vue({ render: h => h(ClockWidget) }).$mount(el)
});

import Page from "./ClockPage.vue";

HomePortal.registerPage({
	name: "clock",
	module: "clock",
	persistent: true,
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
