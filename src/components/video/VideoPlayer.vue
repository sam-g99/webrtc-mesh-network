<template>
  <div
    ref="videoContainer"
    class="video-player"
    :class="{ hideCursor: !showVideoControls }"
    @mouseenter="showControls()"
    @mousemove="resetTimeout()"
    @mouseleave="resetTimeout()"
  >
    <div ref="videoContainer" class="video-container">
      <video ref="mainVideo" autoplay></video>
      <!-- <div class="top-layer">
        <div class="streamer">
          Your Stream
        </div>
        {{}}
        <div class="live">
          <span class="dot"></span>
          Live
        </div>
      </div> -->
      <Controls :show="showVideoControls" />
    </div>
    <div v-if="!videoStream" class="waiting-layer">
      <p class="wait">Waiting for stream</p>
    </div>
  </div>
</template>

<script>
// import Controls from './Controls';
import { mapState, mapMutations } from 'vuex';
import Controls from './VideoControls';

export default {
  components: { Controls },
  //   components: {
  //     // eslint-disable-next-line vue/no-unused-components
  //     Controls,
  //   },
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      streamPending: false,
      showVideoControls: false,
      hideControlsTimeout: null,
    };
  },
  computed: {
    ...mapState(['videoStream', 'conns']),
  },

  watch: {
    videoStream: function(stream) {
      const videoPlayer = this.$refs.mainVideo;
      console.log(stream);
      if (stream) {
        console.log('set stream');
        videoPlayer.srcObject = stream;
      } else {
        if (this.$route.name === 'host') {
          this.sendToAllPeers(this.conns, { type: 'streamStopped' });
        }
        const tracks = videoPlayer.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    },
  },
  mounted() {
    const isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) {
      this.$refs.mainVideo.addEventListener('ended', () => {
        console.log('Data stopped being recieved');
        this.updateStream(null);
        console.log('Video stopped');
      });
      return;
    }
    this.$refs.mainVideo.addEventListener('suspend', () => {
      console.log('Data stopped being recieved');
      this.updateStream(null);
      console.log('Video stopped');
    });
  },
  methods: {
    ...mapMutations(['updateStream']),
    hideControls() {
      this.showVideoControls = false;
    },
    showControls() {
      this.showVideoControls = true;
      this.hideControlsTimeout = setTimeout(this.hideControls, 1500);
    },
    resetTimeout() {
      this.showVideoControls = true;
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = setTimeout(this.hideControls, 1500);
    },
  },
};
</script>

<style lang="scss" scoped>
.video-player {
  background: rgb(29, 29, 29);
  display: flex;
  flex-flow: column;
  max-height: 641px;
  padding-top: 56.25%;
  position: relative;
  width: 100%;

  @include breakpoint(1400) {
    height: 640px;
    padding-top: 0;
  }

  .video-container {
    align-items: center;
    display: flex;
    flex-flow: column;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    video {
      height: 100%;
      outline: none;
      width: 100%;
    }
  }

  .waiting-layer {
    align-items: center;
    background: rgb(20, 20, 20);
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;

    .wait {
      color: white;
      font-size: 30px;
    }
  }

  .top-layer {
    align-items: flex-start;
    display: flex;
    padding: 15px;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 100;

    .streamer {
      color: $offWhite;
    }

    .live {
      align-items: center;
      color: $red;
      display: flex;
      font-size: 18px;
      margin-left: auto;
      width: auto;

      .dot {
        background-color: $red;
        border-radius: 100px;
        height: 10px;
        margin-right: 5px;
        width: 10px;
      }
    }
  }

  .controls {
    bottom: 0;
    position: absolute;
  }
}

.hideCursor {
  cursor: none;
}
</style>
