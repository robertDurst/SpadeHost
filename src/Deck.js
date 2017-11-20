/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file describes the Deck class. The deck is
  simply a collection of cards. Instead of
  designing the deck to be recreatable, aka through
  a new deck function, this deck class is simulating
  a real deck and is instantiated upon creation. The
  deck is shuffled via underscore's implementation of
  Fisher-Yates.
*/

const Card = require('./Card');
const _ = require('underscore');

module.exports = class Deck {
  constructor() {
    this.cards = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j < 14; j++) {
        this.cards.push(new Card(j, i));
      }
    }

    this.cards = _.shuffle(this.cards);
  }
}
