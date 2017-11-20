/*
  Robert Durst, Lightning Spade, November 20, 2017
  This file contains the main game object. This is
  the central object containing the state of
  all objects necessary to the poker game including:
  1) An object containing an array of all current players
  2) A deck of cards
  3) The current pot (an array of bet objects)
  4) The spread, or cards on the table
  5) An array of folded players
  6) An integer representing the game state (see tests for a description
      of the different states)
*/

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

  // Adds a player objects to the folded array
  addFolded(player) {
    this.folded.push(player);
  }

  // A function for easilly determing the folded status of a player
  isFolded(player) {
    return this.folded.indexOf(player) !== -1;
  }

  // Clears the folded array
  clearFolded() {
    this.folded = [];
  }

  // Adds a card to the spread
  addCardToSpread() {
    if (!this.deck.cards.length)
      this.deck = new Deck();
    this.spread.push(this.deck.cards.pop());
  }

  // Empties the spread array
  clearSpread() {
    this.spread = [];
  }

  // Adds a bet to the pot
  incrementPot(bet) {
    this.pot.push(bet);
  }

  // A function that returns the current pot value (int)
  getPotValue() {
    return !this.pot.length
      ? 0
      : this.pot.reduce((sum, bet) => sum + bet.amount, 0);
  }

  // Empties the pot array
  clearPot() {
    this.pot = [];
  }

  // Increments state, modular arithmetic (mod 10)
  incrementState() {
    this.state = this.state === 10
      ? 0
      : ++this.state;
  }

  /*
    Deals cards to the players.Takes in a dealer(Player object)to
    determine which player to begin with.This is not quite correct
    as in real poker the dealer starts with the player to his / her
    right.However,
    this function does correctly go player by player
    poping one card off the deck at a time,
    adding cards to the
    hand property of each player object.
  */
  dealCards(dealer) {
    let curPlayerIndex = this.playerContainer.players.indexOf(dealer);
    let curIndex;
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < this.playerContainer.players.length; j++) {
        curIndex = (curPlayerIndex + j) % (this.playerContainer.players.length);
        if (this.deck.cards.length) {
          this.playerContainer.players[curIndex].hand.push(this.deck.cards.pop());
        } else {
          this.deck = new Deck();
          this.playerContainer.players[curIndex].hand.push(this.deck.cards.pop());
        }
      }
    }
  }

  // Game reset
  // 1) remove cards from all the players hands
  // 2) Increment state back to 0
  // 3) Remove all cards from spread
  // 4) New deck of cards
  // 5) Remove all bets from the pot
  // 6) Remove all players from folded
  reset() {
    this.playerContainer.players.forEach(x => x.clearHand())
    this.incrementState();
    this.clearSpread();
    this.deck = new Deck();
    this.clearPot();
    this.clearFolded();
  }
}
