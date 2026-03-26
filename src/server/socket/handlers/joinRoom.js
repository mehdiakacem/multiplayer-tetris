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

    const existingGame = gameManager.getGame(room);

    if (existingGame?.started) {
      socket.emit("join-denied", {
        reason: "Game already started",
      });
      return;
    }

    leaveCurrentRoom({ socket, io, gameManager, nextRoom: room });

    const game = existingGame ?? gameManager.createGame(room);

    socket.join(room);
    socket.data.room = room;

    const player = new Player(socket.id, playerName);
    game.addPlayer(player);

    const players = game
      .getPublicState()
      .players.map((p) => ({ id: p.id, name: p.name }));

    io.to(room).emit("player-joined", {
      room,
      players,
      hostId: game.hostId,
    });
  };
}

export function leaveCurrentRoom({ socket, io, gameManager, nextRoom = null }) {
  const currentRoom = socket.data.room;
  if (!currentRoom || currentRoom === nextRoom) return;

  const game = gameManager.getGame(currentRoom);

  socket.leave(currentRoom);
  socket.data.room = undefined;

  if (!game) return;

  const wasRemoved = game.handlePlayerDisconnect
    ? game.handlePlayerDisconnect(socket.id)
    : false;

  if (!wasRemoved) return;

  io.to(currentRoom).emit("player-left", {
    room: currentRoom,
    id: socket.id,
    hostId: game.hostId,
  });

  if (game.started || game.ended) {
    io.to(currentRoom).emit("game-state", {
      room: currentRoom,
      game: game.getPublicState(),
    });
  }

  if (game.isEmpty()) {
    gameManager.removeGame(currentRoom);
  }
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
