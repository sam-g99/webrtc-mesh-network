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
      connsAmount: 0,
      typingTimeouts: [],
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
      const index = newConns.length - 1;
      const conn = newConns[index];
      if (this.connsAmount + 1 === newConns.length) {
        this.connsAmount += 1;
        this.listenForMessages(conn);
        console.log('listening for messages', conn);
      } else {
        console.log('stopped listening for messages from disconnected user');
        this.connsAmount = newConns.length;
      }
    },
  },

  methods: {
    ...mapMutations(['addMessage', 'stoppedTyping']),
    clearTypingInterval(id) {
      console.log('cleared interval');
      const indexOfInterval = this.typingTimeouts.findIndex(
        typer => typer.peerId === id,
      );

      clearTimeout(this.typingTimeouts[indexOfInterval].timeout);
      this.typingTimeouts.splice(indexOfInterval, 0);
      this.typingTimeouts.push({
        timeout: setTimeout(() => {
          this.noLongerTyping(id);
          console.log('interval ran');
        }, 7000),
        peerId: id,
      });
    },
    noLongerTyping(peerId) {
      const isThePeerId = user => user.peerId === peerId;
      const index = this.currentlyTyping.findIndex(isThePeerId);
      this.stoppedTyping(index);
    },
    listenForMessages(conn) {
      conn.on('data', msg => {
        if (msg.type === 'typing') {
          //console.log('typing event', msg);
          if (msg.status === true) {
            const isThePeerId = user => user.peerId === msg.peerId;
            const alreadyTyping = this.currentlyTyping.some(isThePeerId);
            if (!alreadyTyping) {
              this.currentlyTyping.push(msg);
              this.typingTimeouts.push({
                timeout: setTimeout(() => {
                  this.noLongerTyping(msg.peerId);
                  console.log('interval ran');
                }, 7000),
                peerId: msg.peerId,
              });
            } else {
              this.clearTypingInterval(msg.peerId);
              console.log('still typing');
            }
          } else {
            this.noLongerTyping(msg.peerId);
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
    flex-grow: 1;
    height: auto;
    max-width: 100%;
    width: 100%;
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
