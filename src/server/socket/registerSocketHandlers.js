import { handleJoinRoom } from "./handlers/joinRoom.js";
import { handleStartGame } from "./handlers/startGame.js";
import { handlePlayerInput } from "./handlers/playerInput.js";
import { handleDisconnect } from "./handlers/disconnect.js";

export function registerSocketHandlers(io, gameManager) {
  io.on("connection", (socket) => {
    socket.on(
      "join-room",
      handleJoinRoom({ socket, io, gameManager })
    );

    socket.on(
      "start-game",
      handleStartGame({ socket, io, gameManager })
    );

    socket.on(
      "player-input",
      handlePlayerInput({ socket, io, gameManager })
    );

    socket.on(
      "disconnect",
      handleDisconnect({ socket, io, gameManager })
    );
  });
}
