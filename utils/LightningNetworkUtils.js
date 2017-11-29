const grpc = require('grpc');
const fs = require('fs');
const path = require('path');
const lndCert = fs.readFileSync("./lnd_connect_docs/tls.cert");
const credentials = grpc.credentials.createSsl(lndCert);
const lnrpcDescriptor = grpc.load("./lnd_connect_docs/rpc.proto");
const lnrpc = lnrpcDescriptor.lnrpc;
const lightning = new lnrpc.Lightning('localhost:10002', credentials);
const ByteBuffer = require('bytebuffer');
const bitcore = require('bitcore-lib');
const Bluebird = require('bluebird');
const BufferUtil = bitcore.util.buffer;


listPeers = () => {
  return new Promise( function(resolve, reject){
    lightning.listPeers({}, function(err, response) {
      err ? reject(err) : resolve(response);
    });
  })
}

listOpenChannels = () => {
  return new Promise( function(resolve, reject){
    lightning.listChannels({}, function(err, response) {
      err ? reject(err) : resolve(response);
    });
  })
}

verifyMessage = (msg, signature) => {
  return new Promise( function(resolve, reject){
    lightning.verifyMessage({
      msg,
      signature
    }, function(err, response) {
      err ? reject(err) : resolve(response);
    });
  })
}



subscribeChannelNotifications = () => {
  return lightning.subscribeChannelGraph({})
}

module.exports = {
  listPeers,
  listOpenChannels,
  verifyMessage
}
