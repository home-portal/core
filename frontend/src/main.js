import { createApp } from "vue";
import App from "./App.vue";
import VueMoleculer from "./moleculer";
import "./home-portal";
// Font Awesome loaded via <link> in index.html to avoid Vite mangling Unicode content values
import "./weather-icons/sass/weather-icons.scss";

// Import common styles
import "./styles/app.scss";

const app = createApp(App);
app.use(VueMoleculer);
app.mount("#app");
