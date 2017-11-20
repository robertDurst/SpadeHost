const chai = require('chai');
const gameState = require('../src/GameState');
const { getWinner } = require('../src/DetermineWinner');

let assert = chai.assert;

describe('Initial state', function(){

  it('Initial state should be 0.', async function(){
    assert.equal(gameState.state, 0);
  });

  it('Should have no players to start.', function(){
    assert.lengthOf(gameState.playerContainer.players, 0);
  });

  it('Should initialize to 54 cards.', async function(){
    assert.lengthOf(gameState.deck.cards, 52);
  });

})

describe('State 0: before game begins, open for players to enter/exit', function() {

  it('Game state should be 0.', async function(){
    assert.equal(gameState.state, 0);
  });

  it('Should have 1 player in player list.', function(){
    gameState.playerContainer.addPlayer('player1');
    gameState.playerContainer.addPlayer('player2');
    gameState.playerContainer.addPlayer('player3');
    gameState.playerContainer.addPlayer('player4');
    assert.lengthOf(gameState.playerContainer.players, 4);
  });

});

describe('State 1: deal cards', function() {

  it('Game state should be 1.', async function(){
    gameState.incrementState();
    assert.equal(gameState.state, 1);
  });

  it('Player 1 should be the dealer.', function(){
    gameState.playerContainer.newDealer();
    assert.equal(gameState.playerContainer.dealer, gameState.playerContainer.players[0]);
  });

  it('Pot should be 0.', function(){
    assert.equal(gameState.getPotValue(), 0);
  });

  it('Player 1,2,3, and 4 should have two cards in their hand.', function(){
    gameState.dealCards(gameState.playerContainer.dealer);
    assert.lengthOf(gameState.playerContainer.players[0].hand, 2);
    assert.lengthOf(gameState.playerContainer.players[1].hand, 2);
    assert.lengthOf(gameState.playerContainer.players[2].hand, 2);
    assert.lengthOf(gameState.playerContainer.players[3].hand, 2);
  });

});

describe('State 2: round of betting with 0 cards on the table', function() {

  it('Game state should be 2.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 2);
  });

  it('Player 1 bets 10, Player 2 folds, and Player 3+4 call.', function(){
    // Player 1 makes a bet
    var bet = gameState.playerContainer.players[0].makeBet(10);
    gameState.incrementPot(bet);

    // Player 2 Folds
    gameState.playerContainer.players[1].fold();
    gameState.addFolded(gameState.playerContainer.players[1]);

    // Player 3 Calls
    bet = gameState.playerContainer.players[2].makeBet(gameState.pot[gameState.pot.length-1].amount);
    gameState.incrementPot(bet);

    // Player 4 Calls
    bet = gameState.playerContainer.players[3].makeBet(gameState.pot[gameState.pot.length-1].amount);
    gameState.incrementPot(bet);

    assert.lengthOf(gameState.folded, 1);
    assert.lengthOf(gameState.playerContainer.players[1].hand, 0);
    assert.lengthOf(gameState.pot, 3);
    assert.equal(gameState.getPotValue(), 30);
  });

});

describe('State 3: reveal first 3 cards on the table', function() {

  it('Game state should be 3.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 3);
  });

  it('Should be no cards on the table to start', function(){
    assert.lengthOf(gameState.spread, 0);
  });

  it('Should be 3 cards on the table after drawing.', function(){
    gameState.addCardToSpread();
    gameState.addCardToSpread();
    gameState.addCardToSpread();
    assert.lengthOf(gameState.spread, 3);
  });

});

describe('State 4: round of betting with 3 cards on the table', function() {

  it('Game state should be 4.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 4);
  });

  it('Player 1 bets 20, Player 3 folds, and Player 4 calls.', function(){
    // Player 1 makes a bet
    var bet = gameState.playerContainer.players[0].makeBet(20);
    gameState.incrementPot(bet);

    // Player 2 Folds
    gameState.playerContainer.players[2].fold();
    gameState.addFolded(gameState.playerContainer.players[2]);

    // Player 4 Calls
    bet = gameState.playerContainer.players[3].makeBet(gameState.pot[gameState.pot.length-1].amount);
    gameState.incrementPot(bet);

    assert.lengthOf(gameState.folded, 2);
    assert.lengthOf(gameState.playerContainer.players[2].hand, 0);
    assert.lengthOf(gameState.pot, 5);
    assert.equal(gameState.getPotValue(), 70);
  });

});

describe('State 5: reveal the last card on the fourth card on the table', function() {
  it('Game state should be 5.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 5);
  });
  it('Should be 3 cards on the table to start', function(){
    assert.lengthOf(gameState.spread, 3);
  });
  it('Should be 4 cards on the table after drawing.', function(){
    gameState.addCardToSpread();
    assert.lengthOf(gameState.spread, 4);
  });
});

describe('State 6: round of betting with 4 cards on the table', function() {
  it('Game state should be 6.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 6);
  });

  it('Player 1 bets, Player 4 bets more, and Player 1 calls.', function(){
    // Player 1 makes a bet
    var bet1 = gameState.playerContainer.players[0].makeBet(30);
    gameState.incrementPot(bet1);

    // Player 4 makes a counter bet
    var bet2 = gameState.playerContainer.players[3].makeBet(40);
    gameState.incrementPot(bet2);

    // Player 1 Calls
    var bet = gameState.playerContainer.players[0].makeBet(bet2.amount - bet1.amount);
    gameState.incrementPot(bet);

    assert.lengthOf(gameState.pot, 8);
    assert.equal(gameState.getPotValue(), 150);
  });
});

describe('State 7: reveal the last card on the table', function() {
  it('Game state should be 7.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 7);
  });
  it('Should be 4 cards on the table to start', function(){
    assert.lengthOf(gameState.spread, 4);
  });
  it('Should be 5 cards on the table after drawing.', function(){
    gameState.addCardToSpread();
    assert.lengthOf(gameState.spread, 5);
  });
});

describe('State 8: round of betting with 5 cards on the table', function() {
  it('Game state should be 8.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 8);
  });

  it('Player 1+4 check.', function(){
    assert.lengthOf(gameState.pot, 8);
    assert.equal(gameState.getPotValue(), 150);
  });
});

describe('State 9: players reveal their hands', function() {
  it('Game state should be 9.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 9);
  });
});

describe('State 10: pot is distributed and game state is reset', function() {
  it('Game state should be 10.', function(){
    gameState.incrementState();
    assert.equal(gameState.state, 10);
  });
  it('Should be 5 cards on the table to start', function(){
    assert.lengthOf(gameState.spread, 5);
  });
  it('Should be 0 cards on the table after reset.', function(){
    gameState.clearSpread();
    assert.lengthOf(gameState.spread, 0);
  });
  it('Player 1,2,3, and 4 should have 0 cards in their hand.', function(){
    gameState.playerContainer.players.forEach( x => x.clearHand())
    assert.lengthOf(gameState.playerContainer.players[0].hand, 0);
    assert.lengthOf(gameState.playerContainer.players[1].hand, 0);
    assert.lengthOf(gameState.playerContainer.players[2].hand, 0);
    assert.lengthOf(gameState.playerContainer.players[3].hand, 0);
  });
});
