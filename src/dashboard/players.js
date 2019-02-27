import Vue from 'vue';
import '@/plugins/vuetify';
import i18n from '@/plugins/i18n';
import App from './players.vue';

Vue.config.productionTip = false;

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
