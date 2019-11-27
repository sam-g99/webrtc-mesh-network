<template>
  <div class="video-player">
    <video ref="mainVideo" controls autoplay></video>
    <div v-if="!videoStream" class="video-player__layer">
      <p class="wait">Waiting for stream</p>
    </div>
  </div>
</template>

<script>
// import Controls from './Controls';
import { mapState, mapMutations } from 'vuex';

export default {
  //   components: {
  //     // eslint-disable-next-line vue/no-unused-components
  //     Controls,
  //   },
  // eslint-disable-next-line vue/require-prop-types
  computed: {
    ...mapState(['videoStream']),
  },

  watch: {
    videoStream: function(stream) {
      console.log('reacted');
      const videoPlayer = this.$refs.mainVideo;
      if (stream) {
        videoPlayer.srcObject = stream;
      } else {
        console.log('stopped');
        const tracks = videoPlayer.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    },
  },
  mounted() {
    this.$refs.mainVideo.addEventListener('suspend', () => {
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
.video-player {
  width: 600px;

  video {
    max-height: 620px;
    width: 100%;
  }
}
</style>
