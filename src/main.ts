import { createApp } from "vue";
import "./assets/css/main.css";
import { router } from "./plugins/router.plugin";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
