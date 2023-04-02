import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import PrimeVue from "primevue/config";
import Loading from "./components/Loading.vue";
import "primevue/resources/themes/md-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.baseURL = "http://localhost:8080/";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.component("Loading", Loading);
app.config.globalProperties.$http = axios;

app.mount("#app");
