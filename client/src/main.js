import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMq from "vue-mq";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate, { inject: false });
Vue.use(VueMq, {
  breakpoints: {
    sm: 728,
    md: 1200,
    lg: Infinity
  }
});

Vue.config.productionTip = false;

require("./css/bootstrap.min.css");
require("./css/all.css");
require("./css/css.css");
require("./css/animate.css");
require("./css/odometer.css");
require("./css/odometer-theme-train-station.css");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
