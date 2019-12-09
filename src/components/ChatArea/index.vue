<template>
  <div class="chat-area">
    <div class="title">
      <h3>Room Chat</h3>
      <p class="user-name">Welcome, {{ username }}</p>
    </div>
    <ChatMessages />
    <SendArea />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SendArea from './SendArea';
import ChatMessages from './ChatMessages';

export default {
  components: { SendArea, ChatMessages },
  data() {
    return {
      compressedImage: null,
      currentMessage: '',
      fullImage: null,
      image: null,
      timeout: undefined,
      typing: false,
    };
  },
  computed: {
    ...mapState([
      'avatar',
      'username',
      'open',
      'conns',
      'peerBroker',
      'currentlyTyping',
    ]),
  },
  watch: {
    conns: function(newConns) {
      const conn = newConns[newConns.length - 1];
      this.listenForMessages(conn);
      console.log('Watching for messages from', conn);
    },
  },

  methods: {
    ...mapMutations(['addMessage', 'stoppedTyping']),
    listenForMessages(conn) {
      conn.on('data', msg => {
        if (msg.type === 'typing') {
          if (msg.status === true) {
            this.currentlyTyping.push(msg);
          } else {
            this.stoppedTyping(0);
          }
          return;
        }
        if (msg.type === 'message') {
          this.addMessage(msg);
          console.log('Message recieved', msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-area {
  background: rgb(41, 41, 41);
  display: flex;
  flex-flow: column;
  height: 100%;
  margin-left: auto;
  max-width: 325px;
  width: 100%;

  @include breakpoint-max($mobile) {
    flex-basis: 50%;
    height: auto;
    width: 100%;
    max-width: 100%;
    flex-grow: 1;
    max-height: 50vh;
  }

  .title {
    background: $background;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding: 15px;
    text-align: center;

    h3 {
      color: $lightGreen;
      font-size: 25px;
      font-weight: 400;
      margin-bottom: 10px;
      text-align: center;
    }

    p {
      color: $offWhite;
      font-style: italic;
    }
  }
}
</style>
