/*
  Robert Durst, Lightning Spade, November 20, 2017

*/

const LightningUtils = require('./utils/LightningNetworkUtils');
const Game = require('./src/Game');
const Card = require('./src/Card');
const Deck = require('./src/Deck');
const io = require('socket.io')(3002);

const game = new Game();
Object.keys(io.sockets.sockets).forEach(function(s) {
    io.sockets.sockets[s].disconnect(true);
});

io.on('connection', function (socket) {
  console.log("New connection");
  socket.on('VERACK', async function(channel_info, pub_key) {
    socket.pub_key = pub_key;
    Object.keys(io.sockets.sockets).forEach(function(s) {
      if(!io.sockets.sockets[s].pub_key) io.sockets.sockets[s].disconnect(true);
      else if(io.sockets.sockets[s].pub_key === pub_key && io.sockets.sockets[s] !== socket) io.sockets.sockets[s].disconnect(true);
    });
    const connection_channel_point = channel_info.channel_point.funding_txid !== undefined ? toHexString(channel_info.channel_point.funding_txid) : channel_info.channel_point.split(':')[0];
    const response = await LightningUtils.listOpenChannels();
    const channel_found = (response.channels.filter( x => x.channel_point.split(':')[0] === connection_channel_point).length);
    if(channel_found) {
      socket.emit('VERACK_RECEIVED', 'verify me ;)')
    } else {
      socket.emit('CONNECTION_FAILURE')
    }
  })

  socket.on('ID_VERIFY', async function(signature) {
    let response = await verifyMessage('verify me ;)', signature.signature);

    if(socket.pub_key === response.pubkey && response.valid){
      game.playerContainer.addPlayer(socket.pub_key, socket)
      socket.emit('ID_VERIFIED', game)
      io.emit('GAME_STATE_UPDATE', game)
    } else {
      socket.emit('CONNECTION_FAILURE')
    }
  });

  socket.on('NEXT_STATE', async function() {
    game.playRound(io);
    io.emit('GAME_STATE_UPDATE', game)
  });

  socket.on('EXIT_GAME', async function(pub_key) {
    game.playerContainer.removePlayer(pub_key);
    socket.disconnect(true)
    io.emit('GAME_STATE_UPDATE', game)
  });

});


function toHexString(buffer){
  var str = buffer.toString('hex')
	var reversed = str.split("").reverse();
	return reversed.map((x,i) => !((i+1)%2) ? reversed[i-1] : reversed[i+1]).join("");
}
