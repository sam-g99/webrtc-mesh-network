<template>
  <div>
    <input type="file" @change="processImage($event)" />
  </div>
</template>

<script>
import Compressor from 'compressorjs';

export default {
  methods: {
    convertToDataLink(inputFile) {
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
    imageCompressor(blob) {
      return new Promise((resolve, reject) => {
        new Compressor(blob, {
          quality: 0.6,
          maxWidth: 400,
          success(result) {
            resolve(result);
          },
          error: reject,
        });
      });
    },
    async processImage(event) {
      const file = event.target.files[0];
      if (file) {
        let blob = new Blob(event.target.files, { type: file.type });
        console.log('original', blob);
        blob = await this.imageCompressor(blob);
        console.log('new', blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const base64data = await this.convertToDataLink(blob);
        this.$emit('dataUrl', base64data);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
