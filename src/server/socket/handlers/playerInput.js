export function handlePlayerInput({ socket, io, gameManager }) {
  return (payload) => {
    if (!isValidPlayerInputPayload(payload)) return;

    const { action, clientActionId } = payload;

    const room = socket.data.room;
    if (!room) return;

    const game = gameManager.getGame(room);
    if (!game || !game.started) return;

    game.handleInput(socket.id, action);

    if (typeof clientActionId === "number") {
      socket.emit("input-ack", { actionId: clientActionId });
    }

    io.to(room).emit("game-state", {
      room,
      game: game.getPublicState(),
    });
  };
}

function isValidPlayerInputPayload(payload) {
  return (
      payload &&
      typeof payload === "object" &&
      typeof payload.action === "string" &&
      payload.action.trim() !== "" &&
      (payload.clientActionId === undefined ||
        Number.isInteger(payload.clientActionId))
  );
}
