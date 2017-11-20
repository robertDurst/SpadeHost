/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file describes the Bet class object. This object
  creates bets, linking player to the amount they bet,
  allowing for a mock join table in the pot data
  structure present in Game.js.
*/

const Player = require('./Player');

module.exports = class Bet {
  constructor(betPlayer, betAmount) {
    this.player = betPlayer;
    this.amount = betAmount;
  }
}
