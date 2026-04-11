import { createApp } from "vue";
import Vue3Toastify from 'vue3-toastify';
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./locales";
import AOS from "aos";
import "aos/dist/aos.css";
import "@/assets/css/style.scss";

const app = createApp(App);

app.use(router).use(Antd).use(Vue3Toastify).use(i18n);

router.isReady().then(() => {
  app.mount("#app");
  AOS.init({
    duration: 600,
    easing: "ease-out-cubic",
    once: true,
  });
});
