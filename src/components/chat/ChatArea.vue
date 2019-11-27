<template>
  <div class="chat-room">
    <div class="title">
      <h3>Room Chat</h3>
      <p class="user-name">Welcome, {{ username }}</p>
    </div>
    <div ref="chatContainer" class="chat-container">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-container"
      >
        <div class="username">
          <p>
            {{ message.author }}
          </p>
        </div>
        <div class="date">
          {{ convertDate(message.date) }}
        </div>
        <div v-if="message.content" class="content">
          <p>{{ message.content }}</p>
        </div>
        <div v-if="message.img" class="message-image">
          <img :src="message.img" />
        </div>
      </div>
    </div>
    {{ currentlyTyping }} is typing
    <input
      v-model.trim="currentMessage"
      type="text"
      @keyup.enter="sendMessage"
      @keyup="isTyping"
    />
    <ImageSharing @dataUrl="setImage" />
    <img v-if="image" id="image" class="main-image" :src="image" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import ImageSharing from './ImageSharing';

export default {
  components: { ImageSharing },
  data() {
    return {
      compressedImage: null,
      currentlyTyping: [],
      currentMessage: '',
      fullImage: null,
      image: null,
      messages: [],
      timeout: undefined,
      typing: false,
    };
  },
  computed: {
    ...mapState(['avatar', 'username', 'open', 'conns', 'peerBroker']),
  },
  watch: {
    conns: function(newConns) {
      const conn = newConns[newConns.length - 1];
      this.listenForMessages(conn);
      console.log('Watching for messages from', conn);
    },
  },
  mounted() {},

  methods: {
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
      if (this.typing === false) {
        console.log('typing');
        this.typing = true;
        this.sendToAllPeers(this.conns, {
          type: 'typing',
          status: true,
          username: this.username,
        });
        this.timeout = setTimeout(this.typingTimeout, 2000);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.typingTimeout, 2000);
      }
    },
    convertDate(date) {
      return moment(date).calendar();
    },
    createMessageObject() {
      return {
        type: 'message',
        author: this.username,
        date: new Date(),
        content: this.currentMessage,
        img: this.image,
      };
    },
    resetToTop() {
      const container = this.$refs.chatContainer;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      });
    },
    sendMessage() {
      const message = this.createMessageObject();
      this.messages.push(message);
      this.sendToAllPeers(this.conns, message);
      this.image = null;
      this.currentMessage = '';
      //this.resetToTop();
    },
    async setImage(imageDataUrl) {
      this.image = imageDataUrl;
    },
    listenForMessages(conn) {
      conn.on('data', msg => {
        console.log('message', msg);
        if (msg.type === 'typing') {
          if (msg.status === true) {
            this.currentlyTyping.push(msg.username);
          } else {
            this.currentlyTyping = [];
          }
          return;
        }
        if (msg.type === 'image') {
          document.getElementById('image').src = msg.dataUrl;
          console.log('image recieved');
          return;
        }
        if (msg.type !== 'message') {
          return;
        }
        const container = this.$refs.chatContainer;
        setTimeout(() => {
          this.messages.push(msg);
          container.scrollTop = container.scrollHeight;
        });
        console.log('Message recieved', msg);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-image {
  max-width: 300px;
}

.message-image {
  img {
    max-width: 300px;
  }
}
</style>
