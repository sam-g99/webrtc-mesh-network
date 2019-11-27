<template>
  <div>
    <div class="username-container">
      <input
        type="text"
        :value="username"
        placeholder="Enter a username"
        :maxlength="max"
        required="true"
        @input="setUsername"
      />
      <span class="counter">{{ charactersLeft }}</span>
    </div>
    <button :disabled="disabled" @click="ready">{{ buttonText }}</button>
    <p v-if="longTime && !open" class="service-down">
      Taking a long time to get you a peer id, service may be down.
    </p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      max: 16,
      longTime: false,
    };
  },
  computed: {
    ...mapState(['avatar', 'username', 'open', 'conns', 'peerBroker']),
    charactersLeft: function() {
      return this.max - this.username.length;
    },
    buttonText: function() {
      if (!this.open) {
        return 'Loading...';
      }
      if (this.$router.currentRoute.name === 'host') {
        return 'Host Room';
      } else {
        return 'Join Room';
      }
    },
    disabled: function() {
      if (this.username.trim() && this.open) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.open) {
        this.longTime = true;
      }
    }, 3000);
  },

  methods: {
    ...mapMutations(['updateUsername', 'setReady']),
    setUsername(e) {
      this.updateUsername(e.target.value);
    },
    ready() {
      this.setReady();
      if (this.$router.currentRoute.name === 'client') {
        console.log(this.conns[0]);
        this.conns[0].send({
          type: 'username',
          name: this.username,
          peerId: this.peerBroker.id,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
