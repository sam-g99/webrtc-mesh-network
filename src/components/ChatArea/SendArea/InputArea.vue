<template>
  <textarea
    id="textInput"
    v-model.trim="currentMessage"
    class="message-box"
    type="text"
    :placeholder="placeholder"
    @keydown.enter.exact.prevent="sendMessage"
    @keyup="isTyping"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    image: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentMessage: '',
      timeout: null,
      typing: false,
    };
  },
  computed: {
    ...mapState(['username', 'conns', 'peerBroker', 'avatar']),
    placeholder: function() {
      if (this.image) {
        return 'Send your image';
      } else {
        return 'Send a message';
      }
    },
  },
  mounted() {
    // document.onkeypress = function(e) {
    //   e = e || window.event;
    //   if (e.keyCode === 116) {
    //     setTimeout(() => {
    //       document.getElementById('textInput').focus();
    //     });
    //   }
    // };
  },
  methods: {
    ...mapMutations(['addMessage']),
    createMessageObject() {
      return {
        type: 'message',
        avatar: this.avatar.svg,
        author: this.username,
        date: new Date(),
        content: this.currentMessage,
        img: this.image,
      };
    },
    typingTimeout() {
      this.typing = false;
      this.sendToAllPeers(this.conns, {
        type: 'typing',
        status: false,
        username: this.username,
      });
      console.log('stopped typing');
    },
    isTyping() {
      if (!this.currentMessage.trim()) {
        return;
      }
      if (event.keyCode === 13) {
        return;
      }
      if (this.typing === false) {
        console.log('typing');
        this.typing = true;
        this.sendToAllPeers(this.conns, {
          type: 'typing',
          status: true,
          username: this.username,
          peerId: /*this.peerBroker.id*/ 888,
        });
        this.timeout = setTimeout(this.typingTimeout, 1000);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.typingTimeout, 1000);
      }
    },
    sendMessage() {
      console.log(this.image);
      clearTimeout(this.timeout);
      this.typingTimeout();
      if (!this.currentMessage.trim() && !this.image) {
        return;
      }
      const message = this.createMessageObject();
      this.addMessage(message);
      this.sendToAllPeers(this.conns, message);
      this.currentMessage = '';
      this.$emit('sentMessage');
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  background: #3d3d3d;
  border: none;
  color: $offWhite;
  font-size: 16px;
  height: 45px;
  outline: none;
  padding-bottom: 10px;
  padding-left: 7px;
  padding-right: 80px;
  padding-top: 13px;
  position: relative;
  resize: none;
  width: 100%;
}

::placeholder {
  color: $offWhite;
}
</style>
