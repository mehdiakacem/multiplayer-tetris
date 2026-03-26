import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleStartGame } from "../handlers/startGame.js";

describe("handleStartGame", () => {
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
      startGame: vi.fn(() => true),
      getPublicState: vi.fn(() => ({ players: [] })),
    };

    gameManager = {
      getGame: vi.fn(() => game),
    };
  });

  it("does nothing if socket has no room", () => {
    socket.data = {}; // no room

    const handler = handleStartGame({ socket, io, gameManager });
    handler();

    expect(gameManager.getGame).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if game does not exist", () => {
    gameManager.getGame = vi.fn(() => null);

    const handler = handleStartGame({ socket, io, gameManager });
    handler();

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("does nothing if startGame returns false", () => {
    game.startGame = vi.fn(() => false);

    const handler = handleStartGame({ socket, io, gameManager });
    handler();

    expect(game.startGame).toHaveBeenCalledWith("s1");
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("emits game-started with public state when start succeeds", () => {
    game.getPublicState = vi.fn(() => ({ ok: true }));

    const handler = handleStartGame({ socket, io, gameManager });
    handler();

    expect(gameManager.getGame).toHaveBeenCalledWith("room-1");
    expect(game.startGame).toHaveBeenCalledWith("s1");

    expect(io.to).toHaveBeenCalledWith("room-1");
    expect(emit).toHaveBeenCalledWith("game-started", {
      room: "room-1",
      game: { ok: true },
    });
  });
});
