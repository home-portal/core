const Vue = HomePortal.dependencies.vue;

import Module from "./Module.vue";

HomePortal.registerPage({
	module: "home",
	content: new Vue({ render: h => h(Module) }).$mount().$el
});
