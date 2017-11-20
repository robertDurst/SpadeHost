function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

importTest("Determing Winning Poker Hand Tests", './poker_winner_tests.js');
importTest("Game State Tests", './game_state_tests');
