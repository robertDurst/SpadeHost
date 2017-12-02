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
const DetermineWinner = require('./DetermineWinner');

module.exports = class Game {
  constructor() {
    this.playerContainer = new PlayerContainer();
    this.deck = new Deck();
    this.pot = [];
    this.spread = [];
    this.folded = [];
    this.state = 0;
    this.winner = undefined;
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
    const curPlayerIndex = this.playerContainer.players.reduce( (index, x, i) => x.isDealer ? i : index, -1);
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
    this.winner = undefined;
    this.incrementState();
    this.clearSpread();
    this.deck = new Deck();
    this.clearPot();
    this.clearFolded();
  }

  bettingRound(io) {
    // Start with dealer
    // Set the end index to the dealer to start
    const dealerIndex = this.playerContainer.players.reduce( (index, x, i) => x.isDealer ? i : index, -1);
    let endIndex = dealerIndex;
    let curIndex = dealerIndex;
    const socketId = this.playerContainer.players[dealerIndex].socketId
    const socket = io.sockets.sockets[socketId];


    var self = this;
    var counter = 0;
    function recurse(s) {
      if(curIndex === endIndex && counter === 1) {
        console.log("END OF BETTING");
        self.playRound(io);
        return;
      } else if(counter <= 1) {
        s.emit('YOUR_TURN');
        s.on('MOVE_MADE', async function(move) {
          if(curIndex === endIndex) counter ++;
          curIndex = (curIndex + 1) % self.playerContainer.players.length;
          const socketId = self.playerContainer.players[curIndex].socketId
          const socket = io.sockets.sockets[socketId];
          recurse(socket)
        });
      }
    }

    recurse(socket);


    // Begin loop
    // while(curIndex !== endIndex) {
    //
    // }

      // If bet, set the end index to the current index

    // Round over
  }

  playerBet() {
    // Tell the user it is their turn to bet

    // Set an interval, probably 5-30 seconds

    // On either receipt of player answer of interval ending, go to next player
  }

  playRound(io) {

    if(!this.state) {
      if(this.playerContainer.players.length > 1) {
        this.incrementState();
      }
    } else {
      this.incrementState();
    }
    console.log("ROUND", this.state);
    switch(this.state) {

      // Players can safely enter and exit
      case 0:
        break;

      // Cards are dealt
      case 1:
        this.playerContainer.newDealer();
        this.dealCards();
        // this.playRound(io);
        break;

      // BETTING
      case 2:
        // this.bettingRound(io);
        break;

      // First 3 cards of spread are revealed
      case 3:
        this.addCardToSpread(this.deck.cards.pop());
        this.addCardToSpread(this.deck.cards.pop());
        this.addCardToSpread(this.deck.cards.pop());
        // this.playRound(io);
        break;

      // BETTING
      case 4:
        // this.bettingRound(io);
        break;

      // 4th card of spread revealed
      case 5:
        this.addCardToSpread(this.deck.cards.pop());
        // this.playRound(io);
        break;

      // BETTING
      case 6:
        // this.bettingRound(io);
        break;

      // 5th card of spread revealed
      case 7:
        this.addCardToSpread(this.deck.cards.pop());
        // this.playRound(io);
        break;

      // BETTING
      case 8:
        // this.bettingRound(io);
        break;

      // WINNER IS REVEALED --> currently on this.winner
      case 9:
        let hands = this.playerContainer.players.map( x => x.hand)
        hands = hands.filter( x => !!x.length )
        hands = hands.map( x => x.concat(this.spread));
        const winnerArr = DetermineWinner.getWinner(hands);
        console.log(winnerArr);
        this.winner = winnerArr;
        break;

      // MONEY DISTRIBUTED and game reset
      default:
        this.reset();
    }
  }
}
