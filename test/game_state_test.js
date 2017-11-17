const chai = require('chai');
const Lightning = require('../utils/LightningNetworkUtils');
const Game = require('../GameState/gameState').Game;

let assert = chai.assert;

let game = new Game();

describe('Initial state', function(){

  it('Initial state should be 0.', async function(){
    assert.equal(game.getState(), 0);
  });

  it('Should have no players to start.', function(){
    assert.lengthOf(game.players.getPlayers(), 0);
  });

  it('Should have no cards to start.', async function(){
    assert.lengthOf(game.deck.getDeck(), 0);
  });

  it('Should initialize to 54 cards.', async function(){
    game.deck.newDeck();
    assert.lengthOf(game.deck.getDeck(), 52);
  });

})

describe('State 0: before game begins, open for players to enter/exit', function() {

  it('Game state should be 0.', async function(){
    assert.equal(game.getState(), 0);
  });

  it('Should have 1 player in player list.', function(){
    game.players.addPlayer('player1');
    assert.lengthOf(game.players.getPlayers(), 1);
  });

  it('Should have 2 players in player list.', function(){
    game.players.addPlayer('player2');
    assert.lengthOf(game.players.getPlayers(), 2);
  });

  it('Should have 3 players in player list.', function(){
    game.players.addPlayer('player3');
    assert.lengthOf(game.players.getPlayers(), 3);
  });

  it('Should have 4 players in player list.', function(){
    game.players.addPlayer('player4');
    assert.lengthOf(game.players.getPlayers(), 4);
  });

});

describe('State 1: deal cards', function() {

  it('Game state should be 1.', async function(){
    game.incrementState();
    assert.equal(game.getState(), 1);
  });

  it('Player 1 should be the dealer.', function(){
    game.players.newDealer();
    assert.equal(game.players.getDealer(), game.players.getPlayers()[0]);
  });

  it('Pot should be 0.', function(){
    assert.equal(game.getPotValue(), 0);
  });

  it('Player 1,2,3, and 4 should have two cards in their hand.', function(){
    game.dealCards(game.players.getDealer());
    assert.lengthOf(game.players.getPlayers()[0].getHand(), 2);
    assert.lengthOf(game.players.getPlayers()[1].getHand(), 2);
    assert.lengthOf(game.players.getPlayers()[2].getHand(), 2);
    assert.lengthOf(game.players.getPlayers()[3].getHand(), 2);
  });

});

describe('State 2: round of betting with 0 cards on the table', function() {

  it('Game state should be 2.', function(){
    game.incrementState();
    assert.equal(game.getState(), 2);
  });

  it('Player 1 bets 10, Player 2 folds, and Player 3+4 call.', function(){
    // Player 1 makes a bet
    var bet = game.players.getPlayers()[0].makeBet(10);
    game.incrementPot(bet);

    // Player 2 Folds
    game.players.getPlayers()[1].fold();
    game.addFolded(game.players.getPlayers()[1]);

    // Player 3 Calls
    bet = game.players.getPlayers()[2].makeBet(game.getPot()[game.getPot().length-1].amount);
    game.incrementPot(bet);

    // Player 4 Calls
    bet = game.players.getPlayers()[3].makeBet(game.getPot()[game.getPot().length-1].amount);
    game.incrementPot(bet);

    assert.lengthOf(game.getFolded(), 1);
    assert.lengthOf(game.players.getPlayers()[1].hand, 0);
    assert.lengthOf(game.getPot(), 3);
    assert.equal(game.getPotValue(), 30);
  });

});

describe('State 3: reveal first 3 cards on the table', function() {

  it('Game state should be 3.', function(){
    game.incrementState();
    assert.equal(game.getState(), 3);
  });

  it('Should be no cards on the table to start', function(){
    assert.lengthOf(game.getSpread(), 0);
  });

  it('Should be 3 cards on the table after drawing.', function(){
    game.addCardToSpread();
    game.addCardToSpread();
    game.addCardToSpread();
    assert.lengthOf(game.getSpread(), 3);
  });

});

describe('State 4: round of betting with 3 cards on the table', function() {

  it('Game state should be 4.', function(){
    game.incrementState();
    assert.equal(game.getState(), 4);
  });

  it('Player 1 bets 20, Player 3 folds, and Player 4 calls.', function(){
    // Player 1 makes a bet
    var bet = game.players.getPlayers()[0].makeBet(20);
    game.incrementPot(bet);

    // Player 2 Folds
    game.players.getPlayers()[2].fold();
    game.addFolded(game.players.getPlayers()[2]);

    // Player 4 Calls
    bet = game.players.getPlayers()[3].makeBet(game.getPot()[game.getPot().length-1].amount);
    game.incrementPot(bet);

    assert.lengthOf(game.getFolded(), 2);
    assert.lengthOf(game.players.getPlayers()[2].hand, 0);
    assert.lengthOf(game.getPot(), 5);
    assert.equal(game.getPotValue(), 70);
  });

});

describe('State 5: reveal the last card on the fourth card on the table', function() {
  it('Game state should be 5.', function(){
    game.incrementState();
    assert.equal(game.getState(), 5);
  });
  it('Should be 3 cards on the table to start', function(){
    assert.lengthOf(game.getSpread(), 3);
  });
  it('Should be 4 cards on the table after drawing.', function(){
    game.addCardToSpread();
    assert.lengthOf(game.getSpread(), 4);
  });
});

describe('State 6: round of betting with 4 cards on the table', function() {
  it('Game state should be 6.', function(){
    game.incrementState();
    assert.equal(game.getState(), 6);
  });

  it('Player 1 bets, Player 4 bets more, and Player 1 calls.', function(){
    // Player 1 makes a bet
    var bet1 = game.players.getPlayers()[0].makeBet(30);
    game.incrementPot(bet1);

    // Player 4 makes a counter bet
    var bet2 = game.players.getPlayers()[3].makeBet(40);
    game.incrementPot(bet2);

    // Player 1 Calls
    var bet = game.players.getPlayers()[0].makeBet(bet2.amount - bet1.amount);
    game.incrementPot(bet);

    assert.lengthOf(game.getPot(), 8);
    assert.equal(game.getPotValue(), 150);
  });
});

describe('State 7: reveal the last card on the table', function() {
  it('Game state should be 7.', function(){
    game.incrementState();
    assert.equal(game.getState(), 7);
  });
  it('Should be 4 cards on the table to start', function(){
    assert.lengthOf(game.getSpread(), 4);
  });
  it('Should be 5 cards on the table after drawing.', function(){
    game.addCardToSpread();
    assert.lengthOf(game.getSpread(), 5);
  });
});

describe('State 8: round of betting with 5 cards on the table', function() {
  it('Game state should be 8.', function(){
    game.incrementState();
    assert.equal(game.getState(), 8);
  });

  it('Player 1+4 check.', function(){
    assert.lengthOf(game.getPot(), 8);
    assert.equal(game.getPotValue(), 150);
  });
});

describe('State 9: players reveal their hands', function() {
  it('Game state should be 9.', function(){
    game.incrementState();
    assert.equal(game.getState(), 9);
  });
});

describe('State 10: pot is distributed and game state is reset', function() {
  it('Game state should be 10.', function(){
    game.incrementState();
    assert.equal(game.getState(), 10);
  });
  it('Should be 5 cards on the table to start', function(){
    assert.lengthOf(game.getSpread(), 5);
  });
  it('Should be 0 cards on the table after reset.', function(){
    game.clearSpread();
    assert.lengthOf(game.getSpread(), 0);
  });
});
