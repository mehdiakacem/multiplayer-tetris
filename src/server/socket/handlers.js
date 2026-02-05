import Player from "../game/Player.js";

export function registerSocketHandlers(io, gameManager) {
  io.on("connection", (socket) => {
    let currentRoom = null;

    socket.on("join-room", ({ room, playerName }) => {
      const game = gameManager.getOrCreateGame(room);
      if (game.started) {
        socket.emit("join-denied", {
          reason: "Game already started",
        });
        return;
      }
      socket.join(room);
      currentRoom = room;

      const player = new Player(socket.id, playerName);

      game.addPlayer(player);

      const players = game
        .getPublicState()
        .players.map((p) => ({ id: p.id, name: p.name }));

      io.to(room).emit("player-joined", {
        players,
        hostId: game.hostId,
      });
    });

    socket.on("start-game", () => {
      const game = gameManager.getGame(currentRoom);
      if (!game) return;

      const started = game.startGame(socket.id);
      if (!started) return;

      io.to(currentRoom).emit("game-started", { game: game.getPublicState() });
    });

    socket.on("player-input", ({ action }) => {
      const game = gameManager.getGame(currentRoom);
      if (!game || !game.started) return;
      game.handleInput(socket.id, action);
      io.to(currentRoom).emit("game-state", { game: game.getPublicState() });
    });

    socket.on("disconnect", () => {
      for (const game of gameManager.getAllGames()) {
        if (game.players.has(socket.id)) {
          game.removePlayer(socket.id);

          io.to(game.room).emit("player-left", {
            id: socket.id,
            hostId: game.hostId,
          });

          if (game.isEmpty()) {
            gameManager.removeGame(game.room);
          }
        }
      }
    });
  });
}
