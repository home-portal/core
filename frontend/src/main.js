import Vue from "vue";

// Load Moleculer plugin
import VueMoleculer from "./moleculer";
Vue.use(VueMoleculer);

import HomePortal from "./home-portal";

import "@fortawesome/fontawesome-free/css/all.css";

// Import common styles
import "./styles/app.scss";

// Create Vue app
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
