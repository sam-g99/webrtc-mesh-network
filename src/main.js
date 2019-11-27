import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/layout.css';

import peerConnect from './mixins/peerConnect';
import sendToAllPeers from './mixins/sendToAllPeers';

Vue.mixin({
  methods: {
    peerConnect,
    sendToAllPeers,
  },
});

Vue.config.productionTip = false;
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
