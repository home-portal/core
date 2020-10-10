const Vue = HomePortal.dependencies.vue;

import ClockWidget from "./widgets/ClockWidget.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => new Vue({ render: h => h(ClockWidget) }).$mount(el)
});
