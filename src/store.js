import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: 'user_data',
  storage: window.localStorage,
  reducer: state => ({
    username: state.username,
    avatar: state.avatar,
  }),
});

export default new Vuex.Store({
  state: {
    avatar: '',
    connectedUsernames: '',
    conns: [],
    maxConnections: 10,
    peerBroker: null,
    open: false,
    username: '',
    roomUsernames: [],
    videoStream: '',
    ready: false,
  },
  actions: {},
  mutations: {
    opened(state) {
      state.open = true;
    },
    updateAvatar(state, avatar) {
      state.avatar = avatar;
    },
    updateUsername(state, username) {
      state.username = username;
    },
    setReady(state) {
      state.ready = true;
    },
    addConnection(state, conn) {
      state.conns.push(conn);
    },
    removeConnection(state, index) {
      state.conns.splice(index, 1);
    },
    updateStream(state, payLoad) {
      state.stream = payLoad;
    },
    setPeerConnection(state, conn) {
      state.peerBroker = conn;
    },
    addUsername(state, username) {
      state.roomUsernames.push(username);
    },
    removeUsername(state, index) {
      state.roomUsernames.splice(index, 1);
    },
  },
  plugins: [vuexLocal.plugin],
});
