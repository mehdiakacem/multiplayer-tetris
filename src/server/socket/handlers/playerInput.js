export function handlePlayerInput({ socket, io, gameManager }) {
  return ({ action }) => {
    const room = socket.data.room;
    if (!room) return;

    const game = gameManager.getGame(room);
    if (!game || !game.started) return;

    game.handleInput(socket.id, action);

    io.to(room).emit("game-state", {
      game: game.getPublicState(),
    });
  };
}
