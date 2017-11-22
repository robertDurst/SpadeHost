/*
  Robert Durst, Lightning Spade, November 20, 2017
  The top level game state file. Here where the
  interactions between the server, the Lightning
  Network and the Game object take place.
*/

const Game = require('./Game');

let game = new Game();


module.exports = game;
