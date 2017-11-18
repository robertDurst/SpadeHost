const chai = require('chai');
const scorePokerHand = require('../GameState/pokerDetermineWinner').scorePokerHand;
const Card = require('../GameState/carddeck').Card;

let assert = chai.assert;

/*
  Hands will be given serialized scores. These scores will be given
  the following formats:

  [SCORE][SIG_CARD_1][SIG_CARD_2][SIG_CARD_3][SIG_CARD_4][SIG_CARD_5]

  SCORE: cards will be given a score 0-9 with 9 the highest

  SIG_CARD: cards will be sorted and added to the serialized score
  based on:

  1) If it is a straight only need top number
  2) If it is a pair or 'of a kind' put most significant
     in sorted order witout duplicates
  3) Else, put all in order

  These scores will allow for easy comparison among hands
  at the end of a round.
*/

// Each card is value_num, suite_num
function makeHand(cardArr){
  return cardArr.map( x => new Card(x[0], x[1]));
}

describe('Test Royal Flush', function(){
  it("Royal Flush score array should be [ 9, 14]", function(){
    const hand = makeHand([[1,0],[13,0],[12,0],[11,0],[10,0]]);
    assert.equal(scorePokerHand(hand), [9,14]);
  });
});

describe('Test Straight Flush', function(){
  it("Straight Flush score array should be [ 8, 13]", function(){
    const hand = makeHand([[9,0],[13,0],[12,0],[11,0],[10,0]]);
    assert.equal(scorePokerHand(hand), [8,13]);
  });
});

describe('Test Four of a Kind', function(){
  it("Four of a kind score array should be [ 7, 13, 10]", function(){
    const hand = makeHand([[13,0],[13,0],[13,1],[13,0],[10,0]]);
    assert.equal(scorePokerHand(hand), [7,13,10]);
  });
});

describe('Test Full House', function(){
  it("Full House score array should be [ 6, 13, 10]", function(){
    const hand = makeHand([[13,0],[13,0],[13,1],[10,0],[10,0]]);
    assert.equal(scorePokerHand(hand), [6,13,10]);
  });
});

describe('Test Flush', function(){
  it("Flush score array should be [ 5, 10, 9, 6, 3, 2]", function(){
    const hand = makeHand([[10,0],[9,0],[6,0],[3,0],[2,0]]);
    assert.equal(scorePokerHand(hand), [5,10,9,6,3,2]);
  });
});

describe('Test Straight', function(){
  it("Straight score array should be [ 4, 10, 9, 8, 7, 6]", function(){
    const hand = makeHand([[10,0],[9,1],[6,0],[7,0],[8,0]]);
    assert.equal(scorePokerHand(hand), [4,10,9,8,7,6]);
  });
});

describe('Test 3 of a Kind', function(){
  it("Three of a Kind score array should be [ 3, 10, 13, 2]", function(){
    const hand = makeHand([[10,0],[10,0],[10,1],[13,0],[2,0]]);
    assert.equal(scorePokerHand(hand), [3,10,13,2]);
  });
});

describe('Test 2 Pair', function(){
  it("2 Pair score array should be [ 2, 14, 6, 10]", function(){
    const hand = makeHand([[10,0],[6,0],[1,0],[1,1],[6,0]]);
    assert.equal(scorePokerHand(hand), [2,14,6,10]);
  });
});

describe('Test 1 Pair', function(){
  it("1 Pair score array should be [ 1, 10, 14, 3, 2]", function(){
    const hand = makeHand([[10,0],[10,0],[1,1],[3,0],[2,0]]);
    assert.equal(scorePokerHand(hand), [1,10,14,3,2]);
  });
});

describe('Test High Card', function(){
  it("High Card score array should be [ 0, 12, 11, 9, 7, 2]", function(){
    const hand = makeHand([[9,0],[2,0],[12,1],[11,0],[7,0]]);
    assert.equal(scorePokerHand(hand), [0,12,11,9,7,2]);
  });
});
