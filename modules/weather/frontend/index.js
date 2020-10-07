import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import Page from "./Page.vue";

HomePortal.registerPage({
	name: "weather",
	module: "weather",
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
