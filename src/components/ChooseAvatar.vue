<template>
  <div class="choose-container">
    <p class="pick">Choose an Avatar</p>
    <div class="avatar-container">
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
    </div>
    <!-- <button v-if="currentAvatars !== 0" @click="backAvatars">Back</button> -->
    <button ref="random" class="button random" @click="randomAvatar">
      <img src="@/assets/reload.svg" alt="reload icon" />
      <p>Random Avatars</p>
    </button>
    <!-- <button v-if="avatars.length - 1 !== currentAvatars" @click="forwardsAvatars">
      Forwards
    </button> -->
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
  cursor: pointer;
  transition: transform 0.1s;
  user-select: none;
  width: 100px;

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
  font-size: 17px;
  margin-top: 20px;
  outline: none;
  padding: 10px;
  width: 250px;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  p {
    text-align: center;
    width: 80%;
  }
  img {
    left: 10px;
    top: 6px;
    width: 30px;
  }
}
</style>
