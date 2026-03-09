import "./weather-images/weather-images.scss";

import Widget from "./widgets/Widget.vue";
import WeatherPage from "./WeatherPage.vue";

HomePortal.registerWidget({
	name: "weather",
	module: "ui-weather",
	mountDiv: el => {
		return HomePortal.createModuleApp(Widget).mount(el).$el;
	}
});

HomePortal.registerPage({
	name: "weather",
	module: "ui-weather",
	showInQuickLaunch: true,
	caption: "Weather",
	icon: "fa fa-cloud-sun",
	mountDiv: el => {
		return HomePortal.createModuleApp(WeatherPage).mount(el).$el;
	}
});
