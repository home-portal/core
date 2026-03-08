import "./weather-images/weather-images.scss";

import Widget from "./widgets/Widget.vue";
import WeatherPage from "./WeatherPage.vue";

HomePortal.registerWidget({
	name: "weather",
	module: "ui-weather",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(Widget).mount(el).$el;
	}
});

HomePortal.registerPage({
	name: "weather",
	module: "ui-weather",
	showInQuickLaunch: true,
	caption: "Weather",
	icon: "fa fa-cloud-sun",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(WeatherPage).mount(el).$el;
	}
});
