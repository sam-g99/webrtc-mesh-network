<template>
  <div class="send-area">
    <div v-if="image" class="image-view">
      <div class="remove-image" title="Remove image" @click="removeImage()">
        <p>X</p>
      </div>
      <img :src="image" />
    </div>
    <TenorGif :active="gifActive" @focusAway="close" />
    <CurrentlyTyping />
    <InputArea :image="image" @sentMessage="removeImage" />
    <ImageSharing ref="imageShare" @imageSet="showImage" />
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
      console.log(this.$refs.imageShare.$refs);
      this.$refs.imageShare.$refs.fileInput.value = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.send-area {
  display: flex;
  margin-top: auto;
  position: relative;

  @include breakpoint-max($mobile) {
  }
}

.image-view {
  align-items: center;
  background: rgb(41, 41, 41);
  border: 5px solid rgb(60, 151, 255);
  display: flex;
  position: absolute;
  transform: translateY(-100%);
  width: 100%;
  img {
    margin: 0 auto;
    max-width: 100%;
  }
  .remove-image {
    align-items: center;
    background: rgb(255, 126, 126);
    border-radius: 100%;
    color: rgb(122, 6, 6);
    cursor: pointer;
    display: flex;
    font-weight: bolder;
    height: 25px;
    justify-content: center;
    margin: 5px;
    padding: 5px;
    position: absolute;
    right: 0;
    top: 0;
    user-select: none;
    width: 25px;

    &:hover {
      transform: scale(1.1);
      background: rgb(194, 39, 39);
      color: white;
    }

    &:active {
      transform: scale(1);
    }
  }
}

.gif {
  cursor: pointer;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(1);
  }
}
</style>
