<template>
  <div>
    {{ roomUsernames }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      streaming: false,
      hostId: '',
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
      this.setPeerConnection(this.peerConnect('test556'));

      console.log('Peer connection', this.peerBroker);

      // Retrieve the id for this peer and set it
      this.peerBroker.on('open', id => {
        this.hostId = id;
        this.opened();
        console.log('Host id set to', this.hostId);
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
            if (data.type === 'username') {
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

              // Sending host's chosen username
              conn.send({
                type: 'username',
                name: this.username,
                peerId: this.hostId,
              });

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
.test {
  height: 100px;
  width: 100px;
}
</style>
