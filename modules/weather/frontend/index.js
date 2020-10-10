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

import WeatherPage from "./WeatherPage.vue";

HomePortal.registerPage({
	name: "weather",
	module: "weather",
	showInQuickLaunch: true,
	caption: "Weather",
	icon: "fa fa-cloud-sun",
	mountDiv: el => new Vue({ render: h => h(WeatherPage) }).$mount(el).$el
});
