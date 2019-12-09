<template>
  <div class="send-area">
    <div v-if="image" class="image-view">
      <img :src="image" />
    </div>
    <TenorGif :active="gifActive" @focusAway="close" />
    <CurrentlyTyping />
    <InputArea :image="image" @sentMessage="removeImage" />
    <ImageSharing @imageSet="showImage" />
    <img
      id="gifButton"
      :src="require('@/assets/images/gif.svg')"
      class="gif"
      alt="image icon"
      @click="toggelGif"
    />
  </div>
</template>

<script>
import ImageSharing from './ImageShare';
import InputArea from './InputArea';
import CurrentlyTyping from './CurrentlyTyping';
import TenorGif from './TenorGif';

export default {
  components: { ImageSharing, InputArea, CurrentlyTyping, TenorGif },
  data() {
    return {
      gifActive: false,
      image: null,
    };
  },
  methods: {
    showImage(img) {
      console.log('imageRecieved');
      this.image = img;
    },
    toggelGif() {
      this.gifActive = !this.gifActive;
    },
    close() {
      this.gifActive = false;
    },
    removeImage() {
      console.log('removed');
      this.image = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.send-area {
  display: flex;
  margin-top: auto;
  position: relative;
}

.image-view {
  position: absolute;
  transform: translateY(-100%);
  width: 100%;
  display: flex;
  align-items: center;
  border: 5px solid rgb(60, 151, 255);

  img {
    max-width: 100%;
    margin: 0 auto;
  }
}

.gif {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(1);
  }
}
</style>
