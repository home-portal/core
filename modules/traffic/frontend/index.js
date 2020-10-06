const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";

HomePortal.registerPage({
	module: "traffic",
	content: new Vue({ render: h => h(Module) }).$mount().$el
});
