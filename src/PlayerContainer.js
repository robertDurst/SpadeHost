const Player = require('./Player');

module.exports = class PlayerContainer {
  constructor() {
    this.players = [];
    this.dealer = undefined;
  }

  addPlayer(publicKey) {
    if(this.players.filter ( x => x.pubKey)){
      this.players.push(new Player(publicKey));
    }
  }

  newDealer() {
    if(!this.dealer){
      this.players[0].isDealer = true;
      this.dealer = this.players[0];
    } else {
      const prevDealer = this.players.filter( x => x.isDealer)[0];
      let prevDealerIndex = this.players.indexOf(prevDealer);
      const curDealerIndex = prevDealerIndex === this.players.length - 1 ? 0 : prevDealerIndex ++;
      this.dealer = this.players[curDealerIndex];
    }
  }
}
