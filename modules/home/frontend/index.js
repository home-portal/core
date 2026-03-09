import Page from "./HomePage.vue";

HomePortal.registerPage({
	name: "home",
	module: "home",
	mountDiv: el => {
		return HomePortal.createModuleApp(Page).mount(el).$el;
	}
});
