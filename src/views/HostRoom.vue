<template>
  <div class="main-content">
    <VideoPlayer />
    <StreamButton />
    <RoomMembers />
    <CopyInput :shareLink="shareLink">
      <p class="room-link">Room Link</p>
    </CopyInput>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VideoPlayer from '@/components/video/VideoPlayer';
import StreamButton from '@/components/video/StreamButton';
import RoomMembers from '@/components/RoomMembers';
import CopyInput from '@/components/CopyInput';

export default {
  components: { VideoPlayer, StreamButton, RoomMembers, CopyInput },
  data() {
    return {
      streaming: false,
      hostId: '',
      shareLink: '',
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
      'videoStream',
    ]),
  },
  mounted() {
    this.connectToPeerServer();
    this.recieveConnections();
  },
  methods: {
    ...mapMutations([
      'addConnection',
      'removeConnection',
      'setPeerConnection',
      'removeUsername',
      'addUsername',
      'opened',
    ]),

    /* Connecting to peerjs-server, getting host id so users 
    know where to connect to, setting the share link, error checking */
    connectToPeerServer() {
      // Connection broker, helps peer clients connect to eachother through random ids (peerjs)
      this.setPeerConnection(this.peerConnect());

      console.log('Peer connection', this.peerBroker);

      // Retrieve the id for this peer and set it
      this.peerBroker.on('open', id => {
        this.hostId = id;
        this.opened();
        console.log('Host id set to', this.hostId);
        this.shareLink = `${window.location.origin}/room/${id}`;
      });

      // Some error checking
      this.peerBroker.on('disconnected', () => {
        console.log('Connection to peer server lost.');
      });

      this.peerBroker.on('error', err => {
        console.log(err);
      });
    },

    disconnectEvent(conn) {
      conn.on('close', () => {
        console.log('Connection closed', conn);
        this.conns.forEach((c, i) => {
          if (c.peer === conn.peer) {
            this.removeConnection(i);
            console.log('connection removed', conn.peer);
          }
        });
        this.roomUsernames.forEach((user, i) => {
          if (user.peerId === conn.peer) {
            this.removeUsername(i);
            console.log('username removed', user.name);
          }
        });
      });
    },
    recieveConnections() {
      this.peerBroker.on('connection', conn => {
        /* Limiting the amount of peers to the maxPeerConnections state
        while also letting the new connection know, then closing connection */
        console.log('Connections', this.maxConnections);
        if (this.conns.length == this.maxConnections) {
          conn.on('open', () => {
            conn.send({ type: 'full' });
            conn.close();
          });
          console.log('Connection rejected due to max limit reached');
          return;
        }

        console.log('User connected', conn.peer);

        conn.on('open', () => {
          console.log('New connection opened, pending username.', conn.peer);

          conn.on('data', data => {
            console.log('first event listener');
            if (data.type === 'username') {
              //conn.off('data'); // turning off this event listener
              console.log('Recieved username', data);
              this.addUsername(data);
              console.log('Sending to previous connections', this.conns);
              const newConnectionId = conn.peer;

              this.sendToAllPeers(this.conns, {
                type: 'connection',
                id: newConnectionId,
              });

              this.addConnection(conn);
              console.log('Added to connection list', conn);

              // Sending host's data
              conn.send({
                type: 'username',
                avatar: this.avatar,
                name: this.username,
                peerId: this.hostId,
              });

              if (this.videoStream) {
                this.peerBroker.call(conn.peer, this.videoStream);
              }
              this.disconnectEvent(conn);
            }
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
  overflow-y: auto;
  width: 100%;
  @include breakpoint-max($mobile) {
    height: auto;
  }

  .room-link {
    color: #28b2ff;
    font-style: italic;
  }
}

.test {
  height: 100px;
  width: 100px;
}
</style>
