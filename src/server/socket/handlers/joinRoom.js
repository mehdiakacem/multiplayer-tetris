import Player from "../../game/Player.js";

export function handleJoinRoom({ socket, io, gameManager }) {
  return ({ room, playerName }) => {
    const game = gameManager.getOrCreateGame(room);

    if (game.started) {
      socket.emit("join-denied", {
        reason: "Game already started",
      });
      return;
    }

    socket.join(room);
    socket.data.room = room;

    const player = new Player(socket.id, playerName);
    game.addPlayer(player);

    const players = game
      .getPublicState()
      .players.map((p) => ({ id: p.id, name: p.name }));

    io.to(room).emit("player-joined", {
      players,
      hostId: game.hostId,
    });
  };
}
