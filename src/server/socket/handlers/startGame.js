export function handleStartGame({ socket, io, gameManager }) {
  return () => {
    const room = socket.data.room;
    if (!room) return;

    const game = gameManager.getGame(room);
    if (!game) return;

    const started = game.startGame(socket.id);
    if (!started) return;

    io.to(room).emit("game-started", {
      game: game.getPublicState(),
    });
  };
}
