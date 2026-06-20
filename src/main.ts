import { createApp } from "vue";
import "./assets/css/main.css";
import { router } from "./plugins/router.plugin";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: { preset: Aura },
  })
  .mount("#app");
