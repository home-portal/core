import Page from "./HomePage.vue";

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(Page).mount(el).$el;
	}
});
