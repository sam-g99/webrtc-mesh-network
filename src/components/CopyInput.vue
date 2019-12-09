<template>
  <div>
    <slot></slot>
    <input
      ref="textToCopy"
      type="text"
      :value="`${shareLink}`"
      class="copy-input"
      readonly
    />
    <button @click="copy">
      <slot name="button-text">Copy</slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    shareLink: {
      type: String,
      required: true,
    },
  },
  methods: {
    copy() {
      const link = this.$refs.textToCopy;
      link.select();
      link.setSelectionRange(0, 99999);
      document.execCommand('copy');
    },
  },
};
</script>

<style lang="scss" scoped>
.room-link-container {
  padding: 10px;

  .copy-input {
    background: #25213d;
    border: none;
    color: white;
    font-size: 20px;
    padding: 10px;
  }

  p {
    color: white;
    font-weight: 500;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  button {
    background: rgb(41, 121, 226);
    border: none;
    color: white;
    padding: 13px;
  }
}
</style>
