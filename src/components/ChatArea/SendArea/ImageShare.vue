<template>
  <div :class="{ dragActive: draggedIn }" class="image-sharing">
    <input
      id="image"
      ref="fileInput"
      type="file"
      name="image"
      accept="image/*"
      @change="processImage($event)"
    />
    <label for="image">
      <img :src="require('@/assets/images/imageicon.svg')" alt="image icon" />
    </label>
  </div>
</template>

<script>
import Compressor from 'compressorjs';

export default {
  data() {
    return {
      draggedIn: false,
      image: null,
    };
  },
  mounted() {
    this.dragEvent();
  },
  methods: {
    dragEvent() {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
      });
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
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
    async processImage(event, imageDropped) {
      console.log(event, imageDropped);
      let file = null;
      if (event) {
        console.log('not dragged');
        file = event.target.files[0];
      } else {
        console.log('dragged');
        file = imageDropped;
      }
      console.log(file);
      if (file) {
        const blob = await this.imageCompressor(file);
        console.log('new', blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const base64data = await this.convertToDataLink(blob);
        this.$emit('imageSet', base64data);
      }
    },
    async setImage(imageDataUrl) {
      this.$emit('imageSet', imageDataUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-sharing {
  position: relative;

  input {
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 0.1px;
    z-index: -1;
  }

  img {
    transition: transform 0.2s;
    user-select: none;
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .drag-alert {
    color: white;
    text-align: center;
    align-self: center;
    justify-self: center;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }

  label {
    cursor: pointer;
    display: flex;
    height: 100%;
    padding: 10px;
    position: absolute;
    right: 0;
    top: 0;

    &:hover > img {
      transform: scale(1.1);
    }

    &:active > img {
      transform: scale(1);
    }
  }
}

.dragActive {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  label {
    background: blue;
    width: 100%;
  }
}
</style>
