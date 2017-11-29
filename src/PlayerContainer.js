/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file describes the player container class. This
  class keeps an array of all players and keeps
  track of the dealer. The dealer points to a player
  object.
*/

const Player = require('./Player');

module.exports = class PlayerContainer {
  constructor() {
    this.players = [];
    this.dealer = undefined;
  }

  // Takes in a public key and adds a player object with
  // this public key to the players array if it is unique.
  addPlayer(publicKey, socket) {

    const player = this.players.filter(x => x.pubKey === publicKey);
    if (!(player.length)) {
      this.players.push(new Player(publicKey, socket));
    } else {
      player[0].socketId = socket.id;
    }
  }

  // Takes in a public key and removes a player object with
  // this public key.
  removePlayer(publicKey) {
    this.players.splice(this.players.map(x => x.pubKey).indexOf(publicKey), 1);
  }

  // Rotates the dealer. Instead of outputing the result, it simply
  // updates the dealer property of this class.
  newDealer() {
    if (!this.dealer) {
      this.players[0].isDealer = true;
      this.dealer = this.players[0];
    } else {
      const prevDealer = this.players.filter(x => x.isDealer)[0];
      let prevDealerIndex = this.players.indexOf(prevDealer);
      const curDealerIndex = prevDealerIndex === this.players.length - 1
        ? 0
        : prevDealerIndex++;
      this.dealer = this.players[curDealerIndex];
    }
  }
}
