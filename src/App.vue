<template>
  <div id="App">
    <UserInfo />
    <router-view></router-view>
    <ChatArea />
  </div>
</template>

<script>
import UserInfo from '@/components/UserInfo';
import ChatArea from '@/components/chat/ChatArea';

export default {
  name: 'App',
  components: { UserInfo, ChatArea },
};
</script>

<style lang="scss" scoped></style>
