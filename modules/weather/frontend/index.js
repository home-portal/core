import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

import "./common.scss";
import "./weather-icons/sass/weather-icons.scss";
//import "./weather-icons/sass/weather-icons-wind.scss";
import "./weather-images/weather-images.scss";

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
