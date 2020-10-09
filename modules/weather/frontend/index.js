import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import "./weather-icons.scss";
import "./weather-images.scss";

import Widget from "./widgets/Widget.vue";

HomePortal.registerWidget({
	name: "weather",
	module: "weather",
	mountDiv: el => new Vue({ render: h => h(Widget) }).$mount(el).$el
});

import Page from "./Page.vue";

HomePortal.registerPage({
	name: "weather",
	module: "weather",
	mountDiv: el => new Vue({ render: h => h(Page) }).$mount(el).$el
});
