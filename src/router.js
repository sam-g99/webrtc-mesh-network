import Vue from 'vue';
import Router from 'vue-router';
import HostRoom from '@/views/HostRoom.vue';
import ClientRoom from '@/views/ClientRoom.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'host',
      component: HostRoom,
    },
    {
      path: '/room/:id',
      name: 'client',
      component: ClientRoom,
    },
  ],
});
