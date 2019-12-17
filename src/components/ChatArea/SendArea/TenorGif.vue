<template>
  <div v-if="active" id="tenorArea" class="tenor-search-area">
    <input
      ref="tenorInput"
      v-model="query"
      type="text"
      placeholder="Search Tenor"
      @keyup="isTyping()"
    />
    <div class="gif-results">
      <div
        v-for="index in 20"
        v-if="typing"
        :key="index"
        class="loading-block"
      ></div>
      <img
        v-for="(gif, index) in results"
        :key="index"
        :src="gif"
        loading="lazy"
        @click="sendGif(gif)"
      />
    </div>

    <div v-if="categories" class="categories">
      <div
        v-for="category in categories"
        v-if="category.searchterm !== 'kiss'"
        :key="category.searchterm"
        @click="setQuery(category.searchterm)"
      >
        <div class="category">
          <div
            class="gif-background"
            :style="{ 'background-image': `url(${category.image})` }"
          ></div>
          <div class="overlay"></div>
          <p>{{ category.searchterm }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    active: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },
  data() {
    return {
      api: 'https://api.tenor.com/v1/',
      query: '',
      results: [],
      suggestions: [],
      categories: [],
      typing: false,
      noResults: false,
    };
  },
  computed: {
    ...mapState(['conns', 'avatar', 'username']),
  },
  watch: {
    active: {
      handler(val) {
        console.log('changed', this.$refs);
        if (val) {
          setTimeout(() => {
            this.focusSearchInput();
          });
        } else {
          this.results.length = 0;
          this.query = '';
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getCategories();
    document.addEventListener('click', e => {
      var element = document.getElementById('tenorArea');
      if (element && e.target.id !== 'gifButton') {
        if (e.target !== element && !element.contains(e.target)) {
          if (this.active) {
            this.$emit('focusAway');
          }
        }
      }
    });
  },
  methods: {
    ...mapMutations(['addMessage']),
    typingTimeout() {
      this.searchGifs();
      console.log('stopped typing');
    },
    isTyping() {
      document.getElementById('tenorArea').scrollTop = 0;

      if (event.keyCode === 13) {
        return;
      }
      if (this.typing === false) {
        console.log('typing');
        this.typing = true;
        this.timeout = setTimeout(this.typingTimeout, 300);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.typingTimeout, 300);
      }
    },
    checkBlank() {
      console.log('tacio');
      if (this.query.trim() === '') {
        console.log('blank');
        this.results = [];
      }
    },
    createGifMessage(gifLink) {
      return {
        type: 'message',
        avatar: this.avatar.svg,
        author: this.username,
        date: new Date(),
        content: this.currentMessage,
        img: gifLink,
      };
    },
    async getCategories() {
      const response = await fetch(
        `${this.api}categories?key=QRCRVY2HOQKE&contentfilter=high`,
      );
      const result = await response.json();
      console.log(result.tags);
      result.tags.forEach(cat => {
        this.categories.push(cat);
      });
    },
    focusSearchInput() {
      this.$refs.tenorInput.focus();
    },
    async getSuggestions(e) {
      const response = await fetch(
        `${this.api}autocomplete?key=QRCRVY2HOQKE&q=${e.target.value}&limit=10`,
      );
      const result = await response.json();
      console.log(result);
    },
    setQuery(query) {
      this.typing = true;
      this.query = query;
      document.getElementById('tenorArea').scrollTop = 0;
      this.searchGifs();
    },
    async searchGifs() {
      this.results = [];
      if (this.query.trim() === '') {
        this.typing = false;
        return;
      }
      const response = await fetch(
        `${this.api}search?key=QRCRVY2HOQKE&limit=30&q=${this.query}&contentfilter=high`,
      );

      const gifs = await response.json();
      //console.log(gifs.results[0].media[0].gif);
      if (gifs.results.length === 0) {
        this.noResults = true;
        return;
      }
      gifs.results.forEach(gif => {
        this.results.push(gif.media[0].gif.url);
      });
      document.getElementById('tenorArea').scrollTop = 0;
      setTimeout(() => {
        this.typing = false;
      }, 100);
    },
    sendGif(gifLink) {
      const message = this.createGifMessage(gifLink);
      this.addMessage(message);
      this.sendToAllPeers(this.conns, message);
      this.$emit('focusAway');
    },
  },
};
</script>

<style lang="scss" scoped>
.tenor-search-area {
  align-items: center;
  background: rgb(29, 29, 29);
  display: flex;
  flex-flow: column;
  height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  position: absolute;
  top: -400px;
  width: 100%;

  .loading-block {
    width: 280px;
    background: rgb(56, 56, 56);
    margin-bottom: 10px;
    height: 200px;
    position: relative;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: -200px;
      width: 130px;
      height: 100%;
      transform: skew(-20deg);
      background-image: linear-gradient(
        to right,
        transparent,
        rgba(rgb(255, 255, 255), 0.3),
        transparent
      );
      z-index: 100;
      animation-name: shine;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }
  }

  .gif-results {
    display: flex;
    flex-flow: column;
    align-items: center;
    img {
      margin-bottom: 10px;
      width: 80%;

      &:hover {
        border: 5px solid rgb(244, 255, 90);
        cursor: pointer;
      }

      &:active {
        transform: scale(0.9);
      }
    }
  }
  .categories {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    align-self: center;
    width: 100%;
    position: relative;
    cursor: pointer;
    padding-bottom: 10px;

    .gif-background {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: cover;
      transition-duration: 0.1s;
      &:hover {
        transform: scale(1.1);
      }
    }

    .overlay {
      background: rgba(31, 31, 31, 0.363);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      transition-duration: 0.2s;
    }
    .category {
      background: rgb(68, 68, 68);
      text-align: center;
      padding: 40px;
      overflow: hidden;
      height: 130px;
      width: 160px;
      &:hover > .gif-background {
        transform: scale(1.1);
      }
      &:hover > .overlay {
        background: rgba(255, 255, 255, 0.041);
      }
      color: white;
      position: relative;

      p {
        position: relative;
        z-index: 100;
        pointer-events: none;
        font-weight: 400;
        font-size: 18px;
        text-shadow: 0px 2px 2px rgb(19, 19, 19);
      }
    }
  }
  img {
    max-width: 100%;
  }

  input {
    background: rgb(63, 63, 63);
    border: none;
    border-radius: 100px;
    color: white;
    margin-bottom: 5px;
    margin-top: 5px;
    outline: none;
    padding: 10px;
    position: sticky;
    top: 5px;
    width: 95%;
    z-index: 500;

    &::placeholder {
      color: white;
    }
  }
}
@keyframes shine {
  from {
    left: -200px;
  }
  to {
    left: 120%;
  }
}
</style>
