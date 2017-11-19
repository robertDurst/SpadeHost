const _ = require('underscore');

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

  inputs:
    cardArr: array of Card objects
  outputs:
    socre serialization array: score in the format described above
*/

function scorePokerHand(cardArr){

  // Seperate into values and suites
  const values = cardArr.map( card => {
    switch(card.value) {
      case 'A':
        return 14;
      case 'K':
        return 13;
      case 'Q':
        return 12;
      case 'J':
        return 11;
      default:
        return card.value;
    }
  });
  const suites = cardArr.map( card => card.suite);

  // Check for Flush
  const isFlush = _.size(_.groupBy(suites, (suite) => suite)) === 1;

  // Check for Straight
  const isStraight = values.sort((a,b) => b - a)
                           .reduce( (flag, value, i) => i < 4 && values[i] - values[i+1] !== 1 ? false : flag, true)

  // Group into pairs
  const groupedCards = _.countBy(values, (value) => value);
  let pairs = {};
  _.keys(groupedCards).forEach( valueKey => {
    const numCards = groupedCards[valueKey];
    if(pairs.hasOwnProperty(numCards)) {
      pairs[numCards].push(parseInt(valueKey))
    } else {
      pairs[numCards] = [parseInt(valueKey)];
    }
  } )

  // Sort each of the pairs by card value
  pairs = _.mapObject(pairs, function(val, key) {
    return val.sort((a,b) => b - a);
  });

  // Check for Royal Flush --> 9 score
  if(isStraight && isFlush && pairs[1][0] === 14) return [9, pairs[1][0]];

  // Check for Straight Flush --> 8 score
  if(isStraight && isFlush) return [8, pairs[1][0]];

  // Check for Four of a Kind --> 7 score
  if(pairs[4]) return [7, pairs[4][0], pairs[1][0]];

  // Check for a Full House --> 6 score
  if(pairs[3] && pairs[2]) return [6, pairs[3][0], pairs[2][0]];

  // Check for a Flush --> 5 score
  if(isFlush) return [5, ...values.sort((a,b) => b - a)];

  // Check for a Straight --> 4 score
  if(isStraight) return [4, pairs[1][0]];

  // Check for a Three of a Kind --> 3 score
  if(pairs[3]) return [3, pairs[3][0], ...pairs[1]];

  // Check for a 2 Pair --> 2 score
  if(pairs[2] && pairs[2][1]) return [2, ...pairs[2], pairs[1][0]];

  // Check for a 1 Pair --> 1 score
  if(pairs[2]) return [1, pairs[2][0], ...pairs[1]];

  // High Card --> 0 score
  return [0, ...pairs[1]];
}

/*
  Using the hand serialization score, card comparison will be
  vastly simplified into three cases.

  Case 1: Card ranking, the first number in the card score serialization,
          will be compared. If these don't match, return the higher ranked
          hand.

  Case 2: Highest card comparison for hands of matching rank. Here I will
          Go index by index, comparing the most important cards, sorted in
          descending order. Some hand scoring serializations may appear to
          be out of order, however this is not the case -- consider three
          of a kind. For this hand, the three pair card value is more
          important than the single card values. Thus, a hand of 2,2,2,10,9
          will be ordered 2,10,9.

  Case 3: Tie. If the all the cards are scanned, and the hands are identical,
          a tie will be returned. For now, ties will not be broken by edge
          case rules.

  Inputs:
    hand_1: score serialization array
    hand_2: score serialization array
  Outputs:
    score: integer
      0: tie
      1: hand_1 wins
      2: hand_2 wins
*/

function comparePokerHands(hand_1, hand_2){
  // Case 1
  if( hand_1[0] !== hand_2[0] ) return hand_1[0] > hand_2[0] ? 1 : 2;

  // Case 2
  for( var i = 1; i < hand_1.length; i ++) {
    if(hand_1[i] > hand_2[i]) return 1;
    if(hand_2[i] > hand_1[i]) return 2;
  }

  // Case 3
  return 0;
}

/*
  Takes an array of hands and then returns an array with the index of the
  winning hand. In the case of a tie, the top indices will be returned.
*/

function determineWinner(handArr) {
  let winnerArr = [0];
  let winnerIndex;
  for(var i = 1; i < handArr.length; i ++){
    winnerIndex = comparePokerHands(handArr[winnerArr[0]], handArr[i]);
    if(winnerIndex === 0) winnerArr.push(i);
    if(winnerIndex === 2) winnerArr = [i];
  }
  return winnerArr;
}

module.exports = {
  scorePokerHand,
  comparePokerHands,
  determineWinner
};
