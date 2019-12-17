<template>
  <div class="user-area">
    <div v-for="(user, index) in roomUsernames" :key="index" class="user-box">
      <img :src="user.avatar.svg" alt="user avatar" />
      {{ user.name }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'avatar',
      'conns',
      'maxConnections',
      'peerBroker',
      'ready',
      'username',
      'roomUsernames',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.user-area {
  display: flex;
  padding: 10px;
}

.user-box {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: max-content;
  color: white;
  @include horizontal-spacing(10px);
  img {
    width: 85px;

    @include breakpoint-max(800) {
    }
  }
}
</style>
