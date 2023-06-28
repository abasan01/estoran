import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Croppa from "vue-croppa"
import "vue-croppa/dist/vue-croppa.css";
import Multiselect from 'vue-multiselect'
import "vue-multiselect/dist/vue-multiselect.min.css";

Vue.config.productionTip = false
Vue.use(Croppa)
Vue.component('multiselect', Multiselect)

export const eventBusDiet = new Vue();
export const eventBusAllergy = new Vue();
export const eventBusTables = new Vue();
export const eventBusConfirm = new Vue();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')