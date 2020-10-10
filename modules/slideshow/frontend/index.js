import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import Page from "./Page.vue";

HomePortal.registerPage({
	name: "slideshow",
	module: "slideshow",
	persistent: true,
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
