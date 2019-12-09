<template>
  <div class="controls">
    <button class="volume" @click="toggleMute">
      <RangeSlider class="volume-slider" @valueChange="updateVolume" />
      <img
        :src="require('@/assets/images/videocontrols/max.svg')"
        @click="toggleVolume"
      />
    </button>
    <button class="full-screen" @click="fullScreenToggle">
      <img :src="require('@/assets/images/videocontrols/maximize.svg')" />
    </button>
  </div>
</template>

<script>
import RangeSlider from './RangeSlider';

export default {
  components: { RangeSlider },
  data() {
    return {
      value: 0,
      clientY: 0,
      thumb: 0,
      change: 0,
      defaultThing: 0,
      userVolume: 0,
      muted: false,
    };
  },
  watch: {
    userVolume(volume) {
      if (this.$parent.$refs.mainVideo.volume != volume) {
        this.$parent.$refs.mainVideo.volume = volume;
      }
    },
  },
  mounted() {
    console.log(this.$parent.$refs.mainVideo);

    // document.addEventListener('mousemove', e => {
    //   console.log('tacos');
    //   this.clientY = e.clientY;
    //   console.log('test', (trackBound.top / e.clientY) * 100);
    // });

    // if (percentage > 100) {
    //   videoPlayer.volume = 100 / 100;
    // } else {
    //   videoPlayer.volume = percentage / 100;
    // }
  },
  methods: {
    toggleVolume() {
      if (this.muted) {
        this.userVolume = 0;
        this.muted = true;
      } else {
        this.userVolume = this.previousVolume;
      }
    },
    updateVolume(percentage) {
      this.userVolume = percentage / 100;
      if (percentage > 0) {
        this.userVolume = percentage;
      }
    },
    fullScreenToggle() {
      const iframe = this.$parent.$refs.videoContainer;

      console.log(document.fullscreenElement);
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen();
        }
      }
      iframe.requestFullscreen && iframe.requestFullscreen();
      iframe.webkitRequestFullscreen && iframe.webkitRequestFullscreen();
      iframe.mozRequestFullScreen && iframe.mozRequestFullScreen();
      iframe.msRequestFullscreen && iframe.msRequestFullscreen();
    },

    toggleMute() {
      console.log('mute clicked');
    },
  },
};
</script>

<style lang="scss" scoped>
.volume-slider {
  position: absolute;
  transform: translateY(-100%) translateX(-33px);
}
.controls {
  background: rgba(0, 0, 0, 0.575);
  opacity: 0;
  transition-duration: 0.1s;
  transition-delay: 0.1s;
}

.full-screen {
  img {
    filter: brightness(0) invert(1);
  }
}
button {
  background: none;
  position: relative;
  margin-left: 20px;

  &:hover > .range-slider {
    display: block;
  }
}

.controls {
  display: flex;
  width: 100%;

  .full-screen {
    margin-left: auto;
  }
}
</style>
