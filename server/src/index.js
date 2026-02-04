import GameManager from "./game/GameManager.js";
import { server, io } from "./server.js";
import { registerSocketHandlers } from "./socket/handlers.js";

const PORT = process.env.PORT || 3000;

const gameManager = new GameManager();
registerSocketHandlers(io, gameManager);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Global game loop

setInterval(() => {
  gameManager.getAllGames().forEach((game) => {
    game.tick();
    if (game.started || game.ended) {
      io.to(game.room).emit("game-state", { game: game.getPublicState() });
    }
  });
}, 700);
