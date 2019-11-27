function sendToAllPeers(conns, message) {
  conns.forEach(conn => {
    console.log('Sent message to', conn);
    conn.send(message);
  });
}

export default sendToAllPeers;
