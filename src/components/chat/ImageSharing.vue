<template>
  <div>
    <input type="file" @change="processImage($event)" />
  </div>
</template>

<script>
export default {
  methods: {
    processImage(event) {
      const file = event.target.files[0];
      const blob = new Blob(event.target.files, { type: file.type });
      this.$emit('blob', blob);
    },
  },
};
</script>

<style lang="scss" scoped></style>
