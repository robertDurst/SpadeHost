/*
  Robert Durst, Lightning Spade, November 20, 2017
  Top level testing file. See individual testing files
  for more details.
*/

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

importTest("Determing Winning Poker Hand Tests", './PokerWinnerTests');
importTest("Game State Tests", './GameStateTests');
