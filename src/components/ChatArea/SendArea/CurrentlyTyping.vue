<template>
  <div v-if="currentlyTyping.length > 0" class="currently-typing">
    <ul v-if="!maxAmount" class="typer-list">
      <li v-for="typer in currentlyTyping" :key="typer.id" class="typer">
        {{ typer.username }}
      </li>
      <li class="alert">{{ typingMessage }}</li>
    </ul>
    <p v-if="maxAmount">So many people typing...</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['currentlyTyping']),
    typingMessage: function() {
      const length = this.currentlyTyping.length;
      if (length === 1) {
        return 'is typing...';
      } else {
        return 'are typing';
      }
    },
    maxAmount: function() {
      if (this.currentlyTyping.length > 4) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.currently-typing {
  background: #201f1f;
  color: $offWhite;
  padding: 3px;
  position: absolute;
  transform: translateY(-100%);
  width: 100%;

  p {
    text-align: center;
  }

  .typer-list {
    list-style-type: none;

    .typer {
      float: left;
    }
  }

  .alert {
    float: left;
    padding-left: 5px;
  }
}
</style>
