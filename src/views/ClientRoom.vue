<template>
  <div class="main-content">
    <VideoPlayer />
    <RoomMembers />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VideoPlayer from '@/components/video/VideoPlayer';
import RoomMembers from '@/components/RoomMembers';

export default {
  components: { VideoPlayer, RoomMembers },
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
    ...mapMutations([
      'addUsername',
      'addConnection',
      'opened',
      'updateStream',
      'setHostConn',
    ]),

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
        this.setHostConn(hostConnection); // mutation
        this.opened(); // telling vuex store conn open
        this.addConnection(hostConnection);
        console.log('Sent username', this.username);
        // USER INFO COMPONENT SENDS THE CLIENTS DATA TO HOST
        hostConnection.on('data', data => {
          console.log(data);
          switch (data.type) {
            case 'username':
              console.log("Recieved host's username", data);
              this.addUsername(data);
              break;
            case 'connection':
              {
                console.log('New connection arrived', data);
                const newConnection = this.peerBroker.connect(data.id);
                newConnection.on('open', () => {
                  console.log('New connection opened', newConnection);
                  this.addConnection(newConnection);

                  newConnection.send({
                    type: 'username',
                    name: this.username,
                    avatar: this.avatar,
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
              break;
            case 'streamStopped': {
              console.log('ran');
              this.updateStream(null); // mutation
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
            avatar: this.avatar,
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
.main-content {
  width: 100%;
}

.test {
  height: 100px;
  width: 100px;
}
</style>
