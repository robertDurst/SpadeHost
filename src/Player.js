const Card = require('./Card');
const Bet = require('./Bet');

module.exports = class Person {
    constructor(publicKey) {
      this.pubKey = publicKey;
      this.hand = [];
      this.isDealer = false;
    }

    addToHand(card) {
      this.hand.push(card);
    }

    clearHand() {
      this.hand = [];
    }

    makeBet(amount) {
      return new Bet(this, amount);
    }

    fold() {
      this.hand = [];
    }
}
