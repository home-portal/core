import Vue from "vue";

console.log("Starting Home module...");

import Module from "./Module.vue";

new Vue({
	render: h => h(Module)
}).$mount("#app");
