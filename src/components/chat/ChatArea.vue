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
          1:00pm
        </div>
        <div class="content">
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <input
      v-model.trim="currentMessage"
      type="text"
      @keyup.enter="sendMessage()"
    />
    <ImageSharing @blob="setImage" />
    <img v-if="image" id="image" class="main-image" :src="image" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageSharing from './ImageSharing';

export default {
  components: { ImageSharing },
  data() {
    return {
      currentMessage: '',
      messages: [],
      image: 'ss',
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
    convertDataLink(inputFile) {
      const temporaryFileReader = new FileReader();

      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort();
          reject(new DOMException('Problem parsing input file.'));
        };

        temporaryFileReader.onloadend = () => {
          resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
      });
    },
    createMessageObject() {
      return {
        type: 'message',
        author: this.username,
        date: new Date(),
        content: this.currentMessage,
      };
    },
    sendMessage() {
      const message = this.createMessageObject();
      this.messages.push(message);
      this.sendToAllPeers(this.conns, message);
      const container = this.$refs.chatContainer;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      });
    },
    async setImage(blob) {
      console.log('image set');
      console.log(blob);
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      const base64data = await this.convertDataLink(blob);
      console.log(base64data);
      this.image = base64data;
      this.sendToAllPeers(this.conns, { type: 'image', blob: base64data });
    },
    listenForMessages(conn) {
      conn.on('data', msg => {
        console.log('message', msg);
        if (msg.type === 'image') {
          document.getElementById('image').src = msg.blob;
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
</style>
