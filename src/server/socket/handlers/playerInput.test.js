import { describe, it, expect, vi, beforeEach } from "vitest";
import { handlePlayerInput } from "../handlers/playerInput.js";

describe("handlePlayerInput", () => {
  let socket, io, emit, game, gameManager;

  beforeEach(() => {
    socket = {
      id: "s1",
      data: { room: "room-1" },
      emit: vi.fn(),
    };

    emit = vi.fn();
    io = {
      to: vi.fn(() => ({ emit })),
    };

    game = {
      started: true,
      handleInput: vi.fn(),
      getPublicState: vi.fn(() => ({ players: [] })),
    };

    gameManager = {
      getGame: vi.fn(() => game),
    };
  });

  it("does nothing if socket has no room", () => {
    socket.data = {}; // no room

    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "LEFT" });

    expect(gameManager.getGame).not.toHaveBeenCalled();
    expect(game.handleInput).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if payload is missing", () => {
    const handler = handlePlayerInput({ socket, io, gameManager });
    handler(undefined);

    expect(gameManager.getGame).not.toHaveBeenCalled();
    expect(game.handleInput).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if action is not a non-empty string", () => {
    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "   " });

    expect(gameManager.getGame).not.toHaveBeenCalled();
    expect(game.handleInput).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if game does not exist", () => {
    gameManager.getGame = vi.fn(() => null);

    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "LEFT" });

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if game is not started", () => {
    game.started = false;

    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "LEFT" });

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(game.handleInput).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("handles input and emits game-state when game is started", () => {
    game.getPublicState = vi.fn(() => ({ ok: true }));

    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "LEFT", clientActionId: 7 });

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(game.handleInput).toHaveBeenCalledWith("s1", "LEFT");
    expect(socket.emit).toHaveBeenCalledWith("input-ack", { actionId: 7 });

    expect(io.to).toHaveBeenCalledWith("room-1");
    expect(emit).toHaveBeenCalledWith("game-state", {
      room: "room-1",
      game: { ok: true },
    });
  });

  it("rejects non-integer client action ids", () => {
    const handler = handlePlayerInput({ socket, io, gameManager });
    handler({ action: "LEFT", clientActionId: 1.5 });

    expect(gameManager.getGame).not.toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
  });
});
