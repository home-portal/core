const Vue = HomePortal.dependencies.vue;

import HomePage from "./HomePage.vue";
import ClockWidget from "./widgets/ClockWidget.vue";

HomePortal.registerWidget({
	name: "clock",
	mountDiv: el => new Vue({ render: h => h(ClockWidget) }).$mount(el)
});

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => new Vue({ render: h => h(HomePage) }).$mount(el).$el
});
