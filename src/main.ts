import { createApp } from "vue";
import "./assets/css/main.css";
import { router } from "./plugins/router.plugin";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
import Tooltip from "primevue/tooltip";

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: { preset: Aura },
});

app.directive("tooltip", Tooltip);

app.mount("#app");
