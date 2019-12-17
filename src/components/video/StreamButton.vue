<template>
  <div class="stream-button-container">
    <button v-if="!videoStream" @click="getStream">Start Stream</button>
    <button v-if="videoStream" class="stop" @click="closeStream">
      Stop Stream
    </button>
    <!-- <select v-model="max">
      <option v-for="option in options" :key="option.height" :value="option">
        {{ `${option.height}p` }}
      </option>
    </select> -->

    <div
      v-if="!videoStream"
      ref="selector"
      class="select-quality"
      @mouseenter="showOptions"
      @mouseleave="hideOptions"
    >
      {{ max.height }}p
      <div class="triangle" />
      <div ref="options" class="options-container" :class="{ open: show }">
        <div
          v-for="option in options"
          :key="option.height"
          class="option"
          :value="option"
          @click="setResolution(option)"
        >
          {{ `${option.height}p` }}
        </div>
      </div>
    </div>
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
          frameRate: { max: 24 },
        },
      },
      calls: [],
      streaming: false,
      currentQuality: 720,
      show: false,
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
    showOptions() {
      this.show = true;
    },
    hideOptions() {
      this.show = false;
    },
    setResolution(res) {
      this.max = res;
    },
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
        console.log('sent');
        conn.send({ type: 'streamStopped' });
      });
      this.calls.length = 0; // fastest method
      //this.videoPlayer.srcObject = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.stream-button-container {
  align-items: center;
  display: inline-flex;
  position: relative;
  margin-left: calc(50% - 40px;);
}

button {
  background: rgb(17, 167, 17);
  border: none;
  color: white;
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 10px;
  margin-top: 15px;
  padding: 10px;
  border-radius: 10px;
}

.stop {
  background: red;
}

.select-quality {
  background: rgb(22, 22, 22);
  border-radius: 2px;
  color: $green;
  cursor: pointer;
  padding: 5px;
  position: absolute;
  top: 20px;
  right: -5px;
  user-select: none;
  transform: translateX(100%);

  .options-container {
    height: 0;
    overflow: hidden;
    transition: height 0.2s;
    width: 100%;
    will-change: height;

    .option {
      border-radius: 5px;
      padding: 5px;
      width: 100%;

      &:hover {
        background: $green;
        color: white;
      }
    }
  }

  .open {
    height: 115px;
  }

  .triangle {
    background: tan;
    background: transparent;
    border-bottom: 10px solid $green;
    border-bottom-color: transparent;
    border-left: 7px solid $green;
    border-left-color: transparent;
    border-right: 7px solid $green;
    border-right-color: transparent;
    border-top: 10px solid $green;
    height: 0px;
    margin: 0 auto;
    position: absolute;
    right: 2px;
    top: 15px;
    width: 0px;
  }
}

select::-ms-expand {
  display: none;
}

select:hover {
}

select:focus {
  color: #222;
  outline: none;
}

select option {
  font-weight: normal;
}
</style>
