const LightningUtils = require('./utils/LightningNetworkUtils');
const Players = require('./GameState/players');
const io = require('socket.io')(3002);

io.on('connection', function (socket) {
  socket.on('VERACK', async function(channel_info, pub_key) {
    socket.pub_key = pub_key;
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
      Players.addPlayer(socket.pub_key)
      socket.emit('ID_VERIFIED', Players.getPlayers())
    } else {
      socket.emit('CONNECTION_FAILURE')
    }
  });

});


function toHexString(buffer){
  var str = buffer.toString('hex')
	var reversed = str.split("").reverse();
	return reversed.map((x,i) => !((i+1)%2) ? reversed[i-1] : reversed[i+1]).join("");
}
