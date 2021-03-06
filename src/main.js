import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./http";
import ElementUI from "element-ui";
import moment from "moment";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/reset.css";

Vue.use(ElementUI);
// axios.defaults.baseURL = "http://47.92.107.201:8080/tempstatistics/";
axios.defaults.baseURL = "http://47.94.18.183:8088/tempstatistics/";
// axios.defaults.baseURL = "http://192.168.1.111:8080/tempstatistics/";
// axios.defaults.baseURL = "http://tk356m.natappfree.cc/tempstatistics/";
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
