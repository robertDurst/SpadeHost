const PlayerContainer = require('../GameState/players').PlayerContainer;
const Deck = require('../GameState/carddeck').Deck;

function Game(){
  this.players = new PlayerContainer();
  this.deck = new Deck();
  this.state = 0;
  this.pot = [];
  this.spread = [];
  this.folded = [];
  this.getFolded = function(){
    return this.folded;
  }
  this.addFolded = function(player){
    this.folded.push(player);
  }
  this.isFolded = function(player){
    return this.deck.getDeck().indexOf(player) !== -1;
  }
  this.clearFolded = function(){
    this.folded = [];
  }
  this.getSpread = function(){
    return this.spread;
  }
  this.addCardToSpread = function(){
    const card = this.deck.length ? this.deck.cards.pop() : (this.deck.newDeck(), this.deck.cards.pop());
    this.spread.push(card);
  }
  this.clearSpread = function(){
    this.spread = [];
  }
  this.getPot = function(){
    return this.pot;
  }
  this.getPotValue = function(){
    return !this.pot.length ? 0 : this.pot.reduce( (sum, x) => sum + x.amount, 0);
  }
  this.incrementPot = function(bet){
    this.pot.push(bet);
  }
  this.clearPot = function(){
    this.pot = [];
  }
  this.incrementState = function(){
    this.state = this.state === 10 ? 0 : ++ this.state;
  }
  this.getState = function(){
    return this.state;
  }
  this.dealCards = function(dealer){
    let curPlayerIndex = this.players.getPlayers().indexOf(dealer);
    let curIndex;
    for(var i = 0; i < 2; i ++){
      for(var j = 0; j < this.players.getPlayers().length; j ++){
        curIndex = (curPlayerIndex+j)%(this.players.getPlayers().length);
        if(this.deck.getDeck().length) {
          this.players.getPlayers()[curIndex].hand.push(this.deck.cards.pop());
        } else {
          this.deck.newDeck();
          this.players.getPlayers()[curIndex].hand.push(this.deck.cards.pop());
        }
      }
    }
  }
}

module.exports = {
  Game
}
