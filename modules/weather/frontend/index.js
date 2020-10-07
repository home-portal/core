const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";

HomePortal.registerPage({
	name: "traffic",
	module: "traffic",
	mountDiv: el => new Vue({ render: h => h(Module) }).$mount(el).$el
});
