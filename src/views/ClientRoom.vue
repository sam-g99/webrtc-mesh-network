<template>
  <div>
    <VideoPlayer />
    {{ roomUsernames }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VideoPlayer from '@/components/video/VideoPlayer';

export default {
  components: { VideoPlayer },
  data() {
    return {
      streaming: false,
      firstConnection: false,
    };
  },
  computed: {
    ...mapState([
      'avatar',
      'conns',
      'maxConnections',
      'peerBroker',
      'ready',
      'username',
      'roomUsernames',
    ]),
  },
  mounted() {
    this.connectToPeerServer();
    this.connectToHost();
    this.listenForConnections();
    this.listenForStream();
  },
  methods: {
    ...mapMutations(['addUsername', 'addConnection', 'opened', 'updateStream']),

    disconnectEvent(conn) {
      conn.on('close', () => {
        this.conns.forEach((c, i) => {
          if (c.peer === conn.peer) {
            this.conns.splice(i, 1);
          }
        });
        this.roomUsernames.forEach((user, i) => {
          if (user.peerId === conn.peer) {
            this.roomUsernames.splice(i, 1);
            if (i === 0) {
              alert(
                "Welp your host left, you're better off finding another or hosting a room yourself.",
              );
            }
          }
        });
      });
    },
    connectToPeerServer() {
      // Connection broker, helps peer clients connect to eachother through random ids (peerjs)
      this.$store.commit('setPeerConnection', this.peerConnect(''));

      console.log('Peer connection', this.peerBroker);

      // Retrieve the id for this peer and set it
      this.peerBroker.on('open', id => {
        console.log('Client id set to', id);
      });

      // Some error checking
      this.peerBroker.on('disconnected', () => {
        console.log('Connection to peer server lost.');
      });

      this.peerBroker.on('error', err => {
        console.log(err);
      });
    },
    connectToHost() {
      const hostConnection = this.peerBroker.connect(this.$route.params.id);

      hostConnection.on('open', () => {
        console.log('Host connection open', hostConnection);
        this.opened();
        this.addConnection(hostConnection);
        console.log('Sent username', this.username);
        hostConnection.on('data', data => {
          switch (data.type) {
            case 'username':
              console.log("Recieved host's username", data);
              this.addUsername(data);
              break;
            case 'connection': {
              console.log('New connection arrived', data);
              const newConnection = this.peerBroker.connect(data.id);
              newConnection.on('open', () => {
                console.log('New connection opened', newConnection);
                this.addConnection(newConnection);

                newConnection.send({
                  type: 'username',
                  name: this.username,
                  peerId: this.peerBroker.id,
                });
                newConnection.on('data', data => {
                  if (data.type === 'username') {
                    console.log('Username recieved', data);
                    this.addUsername(data);
                  }
                });
              });
            }
          }
        });
        this.disconnectEvent(hostConnection);
      });
    },
    listenForConnections() {
      this.peerBroker.on('connection', conn => {
        this.addConnection(conn);
        conn.on('open', () => {
          console.log('New connection', conn);
          conn.send({
            type: 'username',
            name: this.username,
            peerId: this.peerBroker.id,
          });

          conn.on('data', data => {
            if (data.type === 'username') {
              console.log('Username recieved', data);
              this.addUsername(data);
            }
          });

          this.disconnectEvent(conn);
        });
      });
    },
    listenForStream() {
      this.peerBroker.on('call', call => {
        call.answer();
        call.on('stream', hostStream => {
          console.log('stream recieved', hostStream);
          this.updateStream(hostStream);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  height: 100px;
  width: 100px;
}
</style>
