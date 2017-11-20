const PlayerContainer = require('./PlayerContainer');
const Deck = require('./Deck');
const Bet = require('./Bet');
const Card = require('./Card');
const Player = require('./Player');

module.exports = class Game {
    constructor() {
      this.playerContainer = new PlayerContainer();
      this.deck = new Deck();
      this.pot = [];
      this.spread = [];
      this.folded = [];
      this.state = 0;
    }

    addFolded(player) {
      this.folded.push(player);
    }

    isFolded(player) {
      return this.folded.indexOf(player) !== -1;
    }

    clearFolded() {
      this.folded = [];
    }

    addCardToSpread() {
      if(!this.deck.cards.length) this.deck = new Deck();
      this.spread.push(this.deck.cards.pop());
    }

    clearSpread() {
      this.spread = [];
    }

    incrementPot(bet) {
      this.pot.push(bet);
    }

    getPotValue() {
      return !this.pot.length ? 0 : this.pot.reduce( (sum, bet) => sum + bet.amount, 0);
    }

    incrementState() {
      this.state = this.state === 10 ? 0 : ++ this.state;
    }

    dealCards(dealer) {
      let curPlayerIndex = this.playerContainer.players.indexOf(dealer);
      let curIndex;
      for(var i = 0; i < 2; i ++){
        for(var j = 0; j < this.playerContainer.players.length; j ++){
          curIndex = (curPlayerIndex+j)%(this.playerContainer.players.length);
          if(this.deck.cards.length) {
            this.playerContainer.players[curIndex].hand.push(this.deck.cards.pop());
          } else {
            this.deck = new Deck();
            this.playerContainer.players[curIndex].hand.push(this.deck.cards.pop());
          }
        }
      }
    }
}
