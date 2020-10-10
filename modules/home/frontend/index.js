const Vue = HomePortal.dependencies.vue;

import HomePage from "./HomePage.vue";

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => new Vue({ render: h => h(HomePage) }).$mount(el).$el
});
