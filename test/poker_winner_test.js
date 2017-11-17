const chai = require('chai');
const pokerHandScore = require('../GameState/pokerDetermineWinner').pokerHandScore;

let assert = chai.expect;

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

describe('Test Royal Flush: 9X', function(){

});

describe('Test Straight Flush: 8X', function(){

});

describe('Test Four of a Kind: 7XX', function(){

});

describe('Test Full House: 6XXX', function(){

});

describe('Test Flush: 5XXXX', function(){

});

describe('Test Straight: 4X', function(){

});

describe('Test 3 of a Kind: 3XXX', function(){

});

describe('Test 2 Pair: 2XXX', function(){

});

describe('Test 1 Pair: 1XXXX', function(){

});

describe('Test High Card: 0XXXXX', function(){

});
