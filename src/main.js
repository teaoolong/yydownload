import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./http";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/reset.css";

Vue.use(ElementUI);
axios.defaults.baseURL = "http://pre.junbaob2b.com/distributer/";
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
