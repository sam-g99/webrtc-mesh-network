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
    currentlyTyping: [],
    hostConn: null,
    maxConnections: 10,
    messages: [],
    open: false, // set to false!
    peerBroker: null,
    ready: false,
    roomUsernames: [],
    username: '',
    videoStream: null,
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
    updateStream(state, media) {
      state.videoStream = media;
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
    addMessage(state, message) {
      state.messages.push(message);
    },
    currentlyTyping(state, user) {
      state.currentlyTyping.push(user);
    },
    stoppedTyping(state, index) {
      state.currentlyTyping.splice(index, 1);
    },
    setHostConn(state, conn) {
      state.hostConn = conn;
    },
  },
  plugins: [vuexLocal.plugin],
});
