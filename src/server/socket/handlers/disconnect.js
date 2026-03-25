export function handleDisconnect({ socket, io, gameManager }) {
  return () => {
    for (const game of gameManager.getAllGames()) {
      const wasRemoved = game.handlePlayerDisconnect
        ? game.handlePlayerDisconnect(socket.id)
        : false;

      if (!wasRemoved) continue;

      io.to(game.room).emit("player-left", {
        id: socket.id,
        hostId: game.hostId,
      });

      if (game.started || game.ended) {
        io.to(game.room).emit("game-state", {
          game: game.getPublicState(),
        });
      }

      if (game.isEmpty()) {
        gameManager.removeGame(game.room);
      }
    }
  };
}
