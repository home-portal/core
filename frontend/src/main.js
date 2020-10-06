import Vue from "vue";

// Load Moleculer plugin
import VueMoleculer from "./moleculer";
Vue.use(VueMoleculer);

import "./home-portal";

import "@fortawesome/fontawesome-free/css/all.css";

// Import common styles
import "./styles/app.scss";

// Create Vue app
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
