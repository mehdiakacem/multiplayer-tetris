import GameManager from "./game/GameManager.js";
import { server, io } from "./server.js";
import { registerSocketHandlers } from "./socket/registerSocketHandlers.js";
import { GAME_TICK_INTERVAL_MS } from "../shared/gameTiming.js";

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
      io.to(game.room).emit("game-state", {
        room: game.room,
        game: game.getPublicState(),
      });
    }
  });
}, GAME_TICK_INTERVAL_MS);
