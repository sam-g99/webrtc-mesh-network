<template>
  <div class="choose-container">
    <p class="pick">Choose an Avatar</p>
    <div class="avatar-container">
      <button
        :disabled="disableBackwards"
        class="button-arrow arrow-backwards"
        @click="backAvatars"
      >
        <span class="arrow"><</span>
      </button>
      <div
        v-for="(avatar, index) in avatars[currentAvatars]"
        :key="index"
        class="avatar test"
        :class="{ chosen: avatar.chosen }"
        @click="setAvatar(index)"
      >
        <div class="avatar-option">
          <img :src="avatar.svg" />
        </div>
        <p v-if="avatar.chosen">Chosen</p>
      </div>
      <button
        :disabled="disableForwards"
        class="button-arrow arrow-forwards"
        @click="forwardsAvatars"
      >
        <span class="arrow"> > </span>
      </button>
    </div>

    <button ref="random" class="button random" @click="randomAvatar">
      <img src="@/assets/reload.svg" alt="reload icon" />
      <p>Random Avatars</p>
    </button>
  </div>
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';
// import tilt from 'vanilla-tilt';

export default {
  data: () => {
    return {
      avatars: [],
      currentAvatars: 0,
    };
  },
  computed: {
    disableBackwards() {
      return this.currentAvatars === 0;
    },

    disableForwards() {
      return this.avatars.length - 1 === this.currentAvatars;
    },
  },
  mounted() {
    this.randomAvatar();
    // setTimeout(() => {
    //   const button = document.querySelectorAll('.test');
    //   button.forEach(b => {
    //     tilt.init(b, {
    //       max: 0,
    //       speed: 200,
    //       glare: true,
    //       scale: 1.1,
    //       'max-glare': 0.1,
    //     });
    //   });
    //});
  },
  methods: {
    svgToDataURL(svgStr) {
      const encoded = encodeURIComponent(svgStr)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');

      const header = 'data:image/svg+xml,';
      const dataUrl = header + encoded;

      return dataUrl;
    },
    setAvatar(index) {
      this.avatars.forEach(a => {
        a.forEach(c => {
          c.chosen = false;
        });
      });
      const avatar = this.avatars[this.currentAvatars][index];
      avatar.chosen = true;
      this.$store.commit('updateAvatar', avatar);
      console.log(this.$store.state.avatar);
    },
    backAvatars() {
      if (this.currentAvatars !== 0) {
        this.currentAvatars -= 1;
      }
    },
    forwardsAvatars() {
      const newIndex = this.currentAvatars + 1;
      if (this.avatars.length !== newIndex) {
        this.currentAvatars = newIndex;
      }
    },
    randomAvatar() {
      let avatars = new Avatars(sprites({}));
      const avatarsLoaded = [];
      new Array(4).fill(null).forEach(() => {
        const salt = this.makeid(4);
        let svg = avatars.create(salt);
        svg = this.svgToDataURL(svg);
        avatarsLoaded.push({ svg: svg, salt: salt, chosen: false });
      });

      this.avatars.push(avatarsLoaded);
      this.currentAvatars = this.avatars.length - 1;
    },
    makeid(length) {
      var result = '';
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu6vwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    },
  },
};
</script>

<style lang="scss">
.user-chosen {
  width: 120px;
}

.choose-container {
  display: flex;
  flex-flow: column;
  margin-bottom: 30px;

  .pick {
    align-self: center;
    background: #1482bf;
    border-radius: 5px;
    color: white;
    justify-self: center;
    margin-bottom: 10px;
    margin-top: 20px;
    padding: 5px;
    text-align: center;
    width: 200px;
  }
}

.avatar {
  display: inline-block;
  padding: 10px;
  padding-bottom: 15px;
  position: relative;
  text-align: center;
  user-select: none;

  p {
    bottom: 5px;
    color: white;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }
}

.avatar-option img {
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  transition: transform 0.1s;
  user-select: none;
  width: 100px;
  -webkit-filter: drop-shadow(3px 3px 2px rgba(34, 34, 34, 0.7));
  filter: drop-shadow(3px 3px 2px rgba(34, 34, 34, 0.7));
  @include breakpoint-max(600) {
    width: 80px;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1);
  }
}

.chosen {
  background: #394349;
}

.random {
  align-self: center;
  background: #4bb3ed;
  border: none;
  border-radius: 100px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  outline: none;
  padding: 10px;
  width: 200px;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.95);
  }

  @include breakpoint-max(600) {
    padding: 8px;
    width: 240px;
  }
}

.button {
  align-items: center;
  display: flex;
  position: relative;
  p {
    text-align: center;
    width: 80%;
  }

  img {
    left: 10px;
    top: 6px;
    width: 27px;
  }
}

.button-arrow:disabled {
  background: rgb(34, 34, 34);
  color: white;
  opacity: 0.8;
}

.button-arrow {
  background: $green;
  border-radius: 2px;
  color: white;
  padding: 10px;
  position: absolute;
  top: 50%;

  &:hover:enabled {
    color: white;
  }
}

.arrow-backwards {
  transform: translateX(-100%) translateY(-100%);
}

.arrow-forwards {
  transform: translateY(-100%);
}

.arrow {
  font-size: 25px;
}
</style>
