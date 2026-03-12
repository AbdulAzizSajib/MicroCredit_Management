import { createApp } from "vue";
import Vue3Toastify from 'vue3-toastify';
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/css/style.scss";

const app = createApp(App);

app.use(router).use(Antd).use(Vue3Toastify).mount("#app");
