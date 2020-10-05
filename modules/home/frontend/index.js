console.log("Starting Home module...");
const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";

HomePortal.createPage(
	"home",
	new Vue({
		render: h => h(Module)
	}).$mount().$el
);
