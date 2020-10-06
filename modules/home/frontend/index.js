const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";
import ClockWidget from "./widgets/ClockWidget.vue";

HomePortal.registerWidget({
	name: "clock",
	mount: el => new Vue({ render: h => h(ClockWidget) }).$mount(el)
});

HomePortal.registerPage({
	module: "home",
	content: new Vue({ render: h => h(Module) }).$mount().$el
});
