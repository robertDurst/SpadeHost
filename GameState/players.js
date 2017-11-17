const Bet = require('../GameState/bet').Bet;

function PlayerContainer(){
  this.players = [];
  this.dealer = undefined;
  this.addPlayer = function(pk){
    if(this.players.filter ( x => x.pub_key)) this.players.push(new Player(pk));
  }
  this.getPlayers = function(){
    return this.players;
  }
  this.getDealer = function(){
    return this.dealer;
  }
  this.newDealer = function(){
    const prevDealer = (this.players.filter( x => x.isDealer));
    if(!(prevDealer.length)){
      this.players[0].isDealer = true;
      this.dealer = this.players[0];
    } else {
      let prevDealerIndex = this.players.indexOf(prevDealer[0]);
      curDealerIndex = (prevDealerIndex === this.players.length - 1 ? 0 : prevDealerIndex ++);
      this.dealer = this.players[curDealerIndex];
    }
  }
}

function Player(pub_key){
  this.pub_key = pub_key;
  this.isDealer = false;
  this.getPlayerInfo = function(){
    return {
      pub_key: this.pub_key,
      isDealer: this.isDealer,
    }
  }
  this.hand = [];
  this.addToHand = function(card){
    this.hand.push(card);
  }
  this.getHand = function(){
    return this.hand;
  }
  this.clearHand = function(){
    this.hand = [];
  }
  this.makeBet = function(amount){
    return new Bet(this, amount);
  }
  this.call = function(amount){
    return new Bet(this, amount);
  }
  this.fold = function(){
    this.hand = [];
  }
}

module.exports = {
  PlayerContainer
}
