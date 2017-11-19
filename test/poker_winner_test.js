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
  const hand_1 = makeHand([[1,0],[13,0],[12,0],[11,0],[10,0]]);
  const hand_2 = makeHand([[1,1],[13,1],[12,1],[11,1],[10,1]]);

  it("Royal Flush score array should be [ 9, 14]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [9,14]);
  });

  it("Royal Flush score array should be [ 9, 14]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [9,14]);
  });
});

describe('Test Straight Flush', function(){
  const hand_1 = makeHand([[9,0],[13,0],[12,0],[11,0],[10,0]]);
  const hand_2 = makeHand([[9,1],[8,1],[12,1],[11,1],[10,1]]);

  it("Straight Flush score array should be [ 8, 13]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [8,13]);
  });

  it("Straight Flush score array should be [ 8, 12]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [8,12]);
  });
});

describe('Test Four of a Kind', function(){
  const hand_1 = makeHand([[13,3],[13,2],[13,1],[13,0],[10,0]]);
  const hand_2 = makeHand([[12,3],[12,2],[12,1],[12,0],[9,0]]);

  it("Four of a kind score array should be [ 7, 13, 10]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [7,13,10]);
  });

  it("Four of a kind score array should be [ 7, 12, 9]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [7,12,9]);
  });
});

describe('Test Full House', function(){
  const hand_1 = makeHand([[13,2],[13,1],[13,0],[10,1],[10,0]]);
  const hand_2 = makeHand([[12,2],[12,1],[12,0],[9,1],[9,0]]);

  it("Full House score array should be [ 6, 13, 10]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [6,13,10]);
  });

  it("Full House score array should be [ 6, 12, 9]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [6,12,9]);
  });
});

describe('Test Flush', function(){
  const hand_1 = makeHand([[10,0],[9,0],[6,0],[3,0],[2,0]]);
  const hand_2 = makeHand([[5,1],[11,1],[6,1],[3,1],[2,1]]);

  it("Flush score array should be [ 5, 10, 9, 6, 3, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [5,10,9,6,3,2]);
  });

  it("Flush score array should be [ 5, 11, 6, 5, 3, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [5,11,6,5,3,2]);
  });
});

describe('Test Straight', function(){
  const hand_1 = makeHand([[14,2],[13,1],[12,0],[11,3],[10,3]]);
  const hand_2 = makeHand([[10,0],[9,1],[6,2],[7,3],[8,0]]);

  it("Straight score array should be [ 4, 14]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [4,14]);
  });
  it("Straight score array should be [ 4, 10]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [4,10]);
  });
});

describe('Test 3 of a Kind', function(){
  const hand_1 = makeHand([[10,2],[10,1],[10,0],[13,0],[2,0]]);
  const hand_2 = makeHand([[3,3],[3,2],[3,1],[14,0],[5,0]]);

  it("Three of a Kind score array should be [ 3, 10, 13, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [3,10,13,2]);
  });

  it("Three of a Kind score array should be [ 3, 3, 14, 5]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [3,3,14,5]);
  });
});

describe('Test 2 Pair', function(){
  const hand_1 = makeHand([[10,0],[6,0],[2,0],[2,1],[6,1]]);
  const hand_2 = makeHand([[14,0],[6,2],[2,2],[2,3],[6,3]]);

  it("2 Pair score array should be [ 2, 6, 2, 10]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [2,6,2,10]);
  });

  it("2 Pair score array should be [ 2, 6, 2, 14]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [2,6,2,14]);
  });
});

describe('Test 1 Pair', function(){
  const hand_1 = makeHand([[10,1],[10,0],[11,1],[13,0],[12,0]]);
  const hand_2 = makeHand([[10,3],[10,2],[2,1],[4,0],[5,0]]);

  it("1 Pair score array should be [ 1, 10, 13, 12, 11]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [1,10,13,12,11]);
  });

  it("1 Pair score array should be [ 1, 10, 5, 4, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [1,10,5,4,2]);
  });
});

describe('Test High Card', function(){
  const hand_1 = makeHand([[9,0],[2,0],[12,1],[11,0],[7,0]]);
  const hand_2 = makeHand([[5,1],[3,3],[2,1],[6,2],[7,2]]);

  it("High Card score array should be [ 0, 12, 11, 9, 7, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_1), [0,12,11,9,7,2]);
  });

  it("High Card score array should be [ 0, 7, 6, 5, 3, 2]", function(){
    assert.deepEqual(scorePokerHand(hand_2), [0,7,6,5,3,2]);
  });
});
