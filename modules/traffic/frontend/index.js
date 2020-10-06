console.log("Starting Maps module...");
const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";

HomePortal.createPage(
	"traffic",
	new Vue({
		render: h => h(Module)
	}).$mount().$el
);
