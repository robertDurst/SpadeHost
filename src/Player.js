/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file describes the Player object. The player
  object ties a player's public key to a hand of
  cards and an isDealer property.
*/

const Card = require('./Card');
const Bet = require('./Bet');

module.exports = class Person {
  constructor(publicKey, socket) {
    this.pubKey = publicKey;
    this.hand = [];
    this.isDealer = false;
    this.isBetting = false;
    this.socketId = socket.id;
  }

  // Adds a card to the player's hand.
  addToHand(card) {
    this.hand.push(card);
  }

  // Clears the player's hand.
  clearHand() {
    this.hand = [];
  }

  // Takes in an amount and returns a Bet object.
  makeBet(amount) {
    return new Bet(this, amount);
  }

  // Clears the players hand, a duplicate of the clearHand function
  // used for code readability purposes.
  fold() {
    this.hand = [];
  }
}
