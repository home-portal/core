"use strict";

import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

const settings = HomePortal.getModuleSettings("external");

import Page from "./Page.vue";

if (Array.isArray(settings.pages)) {
	settings.pages.forEach(opts => {
		HomePortal.registerPage({
			module: "external",
			name: opts.name,
			showInQuickLaunch: opts.showInQuickLaunch != null ? opts.showInQuickLaunch : true,
			caption: opts.caption,
			icon: opts.icon,
			persistent: opts.persistent,
			mountDiv: el => new Vue({ render: h => h(Page, { attrs: { opts } }) }).$mount(el).$el
		});
	});
}
