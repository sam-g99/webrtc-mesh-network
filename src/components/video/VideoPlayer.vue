<template>
  <div class="video-player">
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
      <Controls />
    </div>
    <!-- <div v-if="!videoStream" class="layer">
      <p class="wait">Waiting for stream</p>
    </div> -->
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
    };
  },
  computed: {
    ...mapState(['videoStream']),
  },

  watch: {
    videoStream: function(stream) {
      const videoPlayer = this.$refs.mainVideo;
      console.log(stream);
      if (stream) {
        console.log('set stream');
        videoPlayer.srcObject = stream;
      } else {
        console.log('stopped');
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
  },
};
</script>

<style lang="scss" scoped>
.video-container {
  &:hover > .controls {
    opacity: 1 !important;
    transition-delay: 0s;
  }
}

.video-player {
  background: rgb(29, 29, 29);
  display: flex;
  flex-flow: column;
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  max-height: 641px;

  @include breakpoint(1400) {
    padding-top: 0;
    height: 640px;
  }
  .video-container {
    align-items: center;
    display: flex;
    flex-flow: column;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    video {
      height: 100%;
      outline: none;
      width: 100%;
    }
  }

  .layer {
    position: absolute;
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
</style>
