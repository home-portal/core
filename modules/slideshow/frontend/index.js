import Page from "./Page.vue";

HomePortal.registerPage({
	name: "slideshow",
	module: "slideshow",
	persistent: true,
	mountDiv: el => {
		return HomePortal.createModuleApp(Page).mount(el).$el;
	}
});
