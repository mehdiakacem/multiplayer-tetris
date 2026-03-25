import Player from "../../game/Player.js";

export function handleJoinRoom({ socket, io, gameManager }) {
  return (payload) => {
    if (!isValidJoinPayload(payload)) {
      socket.emit("join-denied", {
        reason: "Invalid room or player name",
      });
      return;
    }

    const { room, playerName } = payload;

    if (room.length > 10 || playerName.length > 10) {
      socket.emit("join-denied", {
        reason: "Room and player names must be at most 10 characters long",
      });
      return;
    }
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

function isValidJoinPayload(payload) {
  return (
    payload &&
    typeof payload === "object" &&
    typeof payload.room === "string" &&
    typeof payload.playerName === "string" &&
    payload.room.trim() !== "" &&
    payload.playerName.trim() !== ""
  );
}
