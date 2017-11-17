function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

importTest("Game State Tests", './game_state_test');
