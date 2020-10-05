import Vue from "vue";

console.log("Starting Home module...");

import Module from "./Module.vue";

export default function () {
	new Vue({
		render: h => h(Module)
	}).$mount("#module-home");
}
