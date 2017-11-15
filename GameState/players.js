let players = [];

function addPlayer(pk) {
  if(players.indexOf(pk) === -1) players.push(pk);
}

function getPlayers() {
  return players;
}

module.exports = {
  addPlayer,
  getPlayers
}
