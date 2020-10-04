import Vue from "vue";

// Load Moleculer-browser
import Moleculer from "./moleculer";
Vue.use(Moleculer);

// Import common styles
import "./styles/app.scss";

// Create Vue app
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
