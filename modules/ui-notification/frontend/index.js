"use strict";

import Main from "./Main.vue";

const container = document.createElement("div");
container.id = "notifications";
document.body.appendChild(container);

const { createApp } = HomePortal.dependencies.vue;
createApp(Main).mount(container);
