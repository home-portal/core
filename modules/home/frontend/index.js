const Vue = HomePortal.dependencies.vue;

import Page from "./HomePage.vue";

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
