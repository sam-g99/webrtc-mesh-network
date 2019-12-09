import Vue from 'vue';
import Router from 'vue-router';
import HostRoom from '@/views/HostRoom.vue';
import ClientRoom from '@/views/ClientRoom.vue';
import RangeSlider from '@/components/video/RangeSlider';

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
    {
      path: '/range',
      name: 'range',
      component: RangeSlider,
    },
  ],
});
