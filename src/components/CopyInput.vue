<template>
  <div class="copy-input-container">
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
.copy-input-container {
  bottom: 10px;
  padding: 10px;
  position: absolute;

  .copy-input {
    background: #ffffff00;
    border: none;
    color: white;
    font-size: 16px;
    outline: none;
    padding: 0px;
    user-select: none;
    width: 270px;
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
    padding: 5px;
    border-radius: 5px;
    font-size: 16px;
    width: 60px;
  }
}
</style>
