/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file describes the Card class. The card class
  is simply a combination of a value and a suite. The
  suite is defined as a string while the value is
  defined as an int. This allows for easy comparison
  of values (note an Ace is a 14).
*/

module.exports = class Card {
  constructor(cardValue, suiteValue) {
    this.value = cardValue;
    this.suite = numToSuite(suiteValue);
  }
}

function numToSuite(num) {
  switch (num) {
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
