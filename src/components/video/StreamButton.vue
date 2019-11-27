<template>
  <div>
    <button v-if="!videoStream" @click="getStream">Start Stream</button>
    <button v-if="videoStream" class="stop" @click="closeStream">
      Stop Stream
    </button>
    <select v-model="max">
      <option v-for="option in options" :key="option.height" :value="option">
        {{ `${option.height}p` }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data: () => {
    return {
      max: { width: 1280, height: 720 },
      options: [],
      constraints: {
        audio: {
          echoCancellation: false,
          googEchoCancellation: false,
          googEchoCancellation2: false,
          googAutoGainControl: false,
          googAutoGainControl2: false,
          googNoiseSuppression: false,
          googNoiseSuppression2: false,
          googHighpassFilter: false,
          googTypingNoiseDetection: false,
        },
        video: {
          width: { max: 1280 },
          height: { max: 720 },
          frameRate: { max: 240 },
        },
      },
      calls: [],
      streaming: false,
    };
  },
  computed: {
    ...mapState(['videoStream', 'conns', 'peerBroker']),
  },
  mounted() {
    const options = [360, 480, 720, 1080];
    options.forEach(height => {
      // for 16:9 ratio, thought it'd be easier than hard coding down the line ¯\_(ツ)_/¯
      const ratio = height * 16;
      const width = ratio / 9;
      this.options.push({ width, height });
    });
  },

  methods: {
    ...mapMutations(['updateStream']),
    async getStream() {
      let stream;
      try {
        const { width, height } = this.max;
        if (width && height) {
          this.constraints.video.width = width;
          this.constraints.video.height = height;
        }
        stream = await navigator.mediaDevices.getDisplayMedia(this.constraints);
      } catch (error) {
        console.log('Hey we cannot get the media sorry', error);
        return;
      }
      this.updateStream(stream);

      //this.videoPlayer.muted = true;
      this.conns.forEach(conn => {
        console.log('called', conn.peer);
        const call = this.peerBroker.call(conn.peer, stream);
        console.log(call);
        this.calls.push(call);
      });
    },

    closeStream() {
      this.updateStream(null);
      this.calls.forEach(call => {
        call.close();
        console.log('call closed', call);
      });
      this.conns.forEach(conn => {
        conn.send({ type: 'streamStoppped' });
      });
      this.calls.length = 0; // fastest method
      //this.videoPlayer.srcObject = null;
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  background: green;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 15px;
  padding: 10px;
}

.stop {
  background: red;
}
</style>
