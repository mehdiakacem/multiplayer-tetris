export function handleDisconnect({ socket, io, gameManager }) {
  return () => {
    for (const game of gameManager.getAllGames()) {
      if (!game.players.has(socket.id)) continue;

      game.removePlayer(socket.id);

      io.to(game.room).emit("player-left", {
        id: socket.id,
        hostId: game.hostId,
      });

      if (game.isEmpty()) {
        gameManager.removeGame(game.room);
      }
    }
  };
}
