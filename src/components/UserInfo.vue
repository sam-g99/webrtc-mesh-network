<template>
  <div v-if="!ready" class="info-container">
    <h1>Webrtc Demo</h1>
    <p class="sub">Screen/Tab Sharing via the browser</p>
    <ChooseAvatar />
    <div class="username-container">
      <div class="chosen-avatar">
        <img v-if="avatar.svg" :src="avatar.svg" alt="chosen avatar" />
      </div>
      <input
        type="text"
        :value="username"
        placeholder="Enter a username"
        :maxlength="max"
        required="true"
        @input="setUsername"
        @keyup.enter="readyUp"
      />
      <span class="counter">{{ charactersLeft }}</span>
    </div>
    <button
      :disabled="disabled"
      :class="{ disabled: disabled, client: clientRoute }"
      @click="readyUp"
    >
      {{ buttonText }}
    </button>
    <p v-if="longTime && !open" class="service-down">
      {{ alertMessage }}
    </p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ChooseAvatar from './ChooseAvatar';

export default {
  components: { ChooseAvatar },
  data() {
    return {
      max: 16,
      longTime: false,
    };
  },
  computed: {
    ...mapState(['avatar', 'username', 'open', 'conns', 'peerBroker', 'ready']),
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

    clientRoute() {
      return this.$route.name === 'client';
    },
    alertMessage() {
      if (this.clientRoute) {
        return 'Taking a long to connect to host, host may not exist, or a turn server is needed.';
      } else {
        return 'Taking a long time to get you a peer id, service may be down.';
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.open) {
        this.longTime = true;
      }
    }, 6000);
  },

  methods: {
    ...mapMutations(['updateUsername', 'setReady']),
    setUsername(e) {
      this.updateUsername(e.target.value);
    },
    readyUp() {
      if (this.disabled) {
        return;
      }
      this.setReady();
      if (this.$router.currentRoute.name === 'client') {
        console.log(this.conns[0]);
        this.conns[0].send({
          type: 'username',
          name: this.username,
          avatar: this.avatar,
          peerId: this.peerBroker.id,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.info-container {
  align-items: center;
  background: $background;
  display: flex;
  flex-flow: column;
  justify-content: center;
  min-height: 100vh;
  position: absolute;
  width: 100%;
  z-index: 500;

  h1 {
    color: $lightGreen;
    font-family: 'Red Hat Text', 'Roboto', sans-serif;
    font-size: 70px;
    font-weight: 300;
    @include breakpoint-max(600) {
      font-size: 55px;
    }
  }

  .sub {
    color: $offWhite;
    font-size: 30px;
    font-weight: 300;
    margin-top: 10px;

    @include breakpoint-max(600) {
      font-size: 22px;
    }
  }

  .username-container {
    align-self: center;
    display: flex;
    margin-right: -35px;
    margin-top: 20px;
    position: relative;

    input {
      border: none;
      border-radius: 5px;
      box-shadow: 0px 2px 2px rgb(39, 39, 39);
      font-size: 20px;
      outline: none;
      padding: 15px;
      width: 400px;
      @include breakpoint-max(600) {
        width: 300px;
      }
    }

    .counter {
      color: $darkBlue;
      font-size: 16px;
      font-weight: bold;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    .chosen-avatar {
      background: rgb(63, 63, 63);
      border-radius: 100px;
      height: 70px;
      left: 0;
      padding: 10px;
      position: absolute;
      top: 50%;
      transform: translate(-105%, -50%);
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        -webkit-filter: drop-shadow(3px 3px 2px rgba(34, 34, 34, 0.7));
        filter: drop-shadow(3px 3px 2px rgba(34, 34, 34, 0.7));
        height: 60px;
        width: 60px !important;
      }
    }
  }

  button {
    background: rgb(12, 158, 105);
    border-radius: 3px;
    color: white;
    font-size: 22px;
    margin-top: 15px;
    min-width: 150px;
    padding: 12px;
    padding-left: 15px;
    -webkit-tap-highlight-color: transparent;
    transition-duration: 0.1s;

    &:hover {
      box-shadow: 0px 5px 5px rgba(19, 19, 19, 0.616);
    }

    &:active {
      box-shadow: none;
    }
  }

  .disabled {
    background: rgb(170, 170, 170);
    color: rgb(19, 19, 19);
  }

  .service-down {
    background: rgb(255, 94, 94);
    border-radius: 100px;
    color: rgb(94, 4, 4);
    margin-top: 10px;
    padding: 5px;
  }
}
</style>
