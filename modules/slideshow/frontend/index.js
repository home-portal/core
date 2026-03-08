import Page from "./Page.vue";

HomePortal.registerPage({
	name: "slideshow",
	module: "slideshow",
	persistent: true,
	mountDiv: el => {
		const { createApp } = HomePortal.dependencies.vue;
		return createApp(Page).mount(el).$el;
	}
});
