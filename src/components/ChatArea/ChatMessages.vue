<template>
  <div ref="chatContainer" class="chat-container">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="message-container"
    >
      <div class="top">
        <img :src="message.avatar" alt="" srcset="" />
        <div class="author">
          {{ message.author }}
        </div>

        <div class="date">
          {{ convertDate(message.date) }}
        </div>
      </div>

      <div v-if="message.content" class="content">
        {{ message.content }}
      </div>

      <div v-if="message.img" class="message-image">
        <img :src="message.img" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  computed: {
    ...mapState(['messages', 'avatar']),
  },
  watch: {
    messages: function() {
      this.resetToBottom();
    },
  },
  methods: {
    convertDate(date) {
      return moment(date).calendar();
    },
    resetToBottom() {
      const container = this.$refs.chatContainer;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  align-items: center;
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  overflow-y: scroll;

  .message-container {
    background: rgb(41, 41, 41);
    border-radius: 0px;
    color: $offWhite;
    padding: 5px;
    width: 96%;
    word-wrap: break-word;
    @include vertical-spacing(10px);

    &:first-of-type {
      margin-top: auto;
    }

    &:last-of-type {
      margin-bottom: 10px;
    }

    .top {
      display: flex;
      margin-bottom: 7px;
      width: 100%;
      align-items: center;

      img {
        width: 30px;
      }

      .author {
        color: rgb(223, 223, 223);
        font-weight: bold;
      }

      .date {
        color: rgb(201, 201, 201);
        font-size: 13px;
        margin-left: auto;
      }
    }

    .content {
      color: #e0e0e0;
    }

    .message-image {
      img {
        max-width: 300px;
        width: 100%;
      }
    }
  }
}
</style>
