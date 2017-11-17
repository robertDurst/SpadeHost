const _ = require('underscore');

function Deck(){
  this.cards = [];
  this.newDeck = function(){
    for (var i = 0; i < 4; i ++) {
      for (var j = 1; j < 14; j ++) {
        const newCard = new Card(j, i);
        this.cards.push(newCard);
      }
    }
    this.cards = _.shuffle(this.cards);
  }
  this.getDeck = function(){
    return this.cards;
  }
}

function Card(value, suite){
  this.value = cardNumToValue(value);
  this.suite = cardNumToSuite(suite);
}

function cardNumToValue(num){
  switch(num) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return num;
  }
}

function cardNumToSuite(num){
  switch(num) {
    case 0:
      return 'Spade';
    case 1:
      return 'Diamond';
    case 2:
      return 'Club';
    case 3:
      return 'Heart';
  }
}

module.exports = {
  Deck
}
