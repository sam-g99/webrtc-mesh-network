<template>
  <div id="App" :style="`height: ${windowHeight}`">
    <UserInfo />
    <router-view></router-view>
    <ChatArea />
  </div>
</template>

<script>
import UserInfo from '@/components/UserInfo';
import ChatArea from '@/components/ChatArea';

export default {
  name: 'App',
  components: { UserInfo, ChatArea },
  data() {
    return {
      windowHeight: '100vh',
    };
  },
  mounted() {
    this.windowHeight = document.documentElement.clientHeight + 'px';
    window.addEventListener('resize', () => {
      this.windowHeight = document.documentElement.clientHeight + 'px';
    });
  },
};
</script>

<style lang="scss" scoped>
#App {
  display: flex;
  height: 100vh;
  width: 100%;

  @include breakpoint-max($mobile) {
    flex-flow: column;
  }
}
</style>
