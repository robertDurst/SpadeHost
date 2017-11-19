const _ = require('underscore');

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

module.exports = {
  scorePokerHand
};
