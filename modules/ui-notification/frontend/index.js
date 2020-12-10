"use strict";

import "regenerator-runtime/runtime";

const Vue = HomePortal.dependencies.vue;

//const settings = HomePortal.getModuleSettings("ui-external");

const container = document.createElement("div", { id: "notifications" });
container.id = "notifications";
document.body.appendChild(container);

import Main from "./Main.vue";
new Vue({ render: h => h(Main) }).$mount(container);
