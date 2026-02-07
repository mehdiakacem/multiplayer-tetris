import { describe, it, expect, vi, beforeEach } from "vitest";
import { handlePlayerInput } from "../handlers/playerInput.js";

describe("handlePlayerInput", () => {
  let socket, io, emit, game, gameManager;

  beforeEach(() => {
    socket = {
      id: "s1",
      data: { room: "room-1" },
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
    handler({ action: "LEFT" });

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(game.handleInput).toHaveBeenCalledWith("s1", "LEFT");

    expect(io.to).toHaveBeenCalledWith("room-1");
    expect(emit).toHaveBeenCalledWith("game-state", {
      game: { ok: true },
    });
  });
});
