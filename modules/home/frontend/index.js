const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";
import ClockWidget from "./widgets/ClockWidget.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => new Vue({ render: h => h(ClockWidget) }).$mount(el)
});

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => new Vue({ render: h => h(Module) }).$mount(el).$el
});
