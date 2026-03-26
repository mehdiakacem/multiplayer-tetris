import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleDisconnect } from "../handlers/disconnect.js";

describe("handleDisconnect", () => {
  let socket, io, emit, gameManager;

  beforeEach(() => {
    socket = { id: "s1", leave: vi.fn(), data: { room: "room-a" } };

    emit = vi.fn();
    io = {
      to: vi.fn(() => ({ emit })),
    };

    gameManager = {
      getGame: vi.fn(() => null),
      removeGame: vi.fn(),
    };
  });

  it("does nothing if socket is not in any game", () => {
    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(socket.leave).toHaveBeenCalledWith("room-a");
    expect(gameManager.getGame).toHaveBeenCalledWith("room-a");
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
    expect(gameManager.removeGame).not.toHaveBeenCalled();
  });

  it("removes player and emits player-left when socket is in a game", () => {
    const gameA = {
      room: "room-a",
      hostId: "h1",
      started: false,
      ended: false,
      handlePlayerDisconnect: vi.fn(() => true),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getGame = vi.fn(() => gameA);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");

    expect(io.to).toHaveBeenCalledWith("room-a");
    expect(emit).toHaveBeenCalledWith("player-left", {
      room: "room-a",
      id: "s1",
      hostId: "h1",
    });

    expect(gameManager.removeGame).not.toHaveBeenCalled();
  });

  it("removes game if it becomes empty after player disconnects", () => {
    const gameA = {
      room: "room-a",
      hostId: "h1",
      started: false,
      ended: false,
      handlePlayerDisconnect: vi.fn(() => true),
      isEmpty: vi.fn(() => true), // 👈 empty now
    };

    gameManager.getGame = vi.fn(() => gameA);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");
    expect(gameManager.removeGame).toHaveBeenCalledWith("room-a");
  });

  it("emits updated game-state when a disconnect ends an active game", () => {
    const emitRoomA = vi.fn();

    io.to = vi.fn(() => ({ emit: emitRoomA }));

    const publicState = {
      room: "room-a",
      started: false,
      ended: true,
      hostId: "s2",
      winner: { id: "s2", name: "Bob" },
      players: [{ id: "s2", name: "Bob", alive: true }],
    };

    const gameA = {
      room: "room-a",
      hostId: "s2",
      started: false,
      ended: true,
      handlePlayerDisconnect: vi.fn(() => true),
      getPublicState: vi.fn(() => publicState),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getGame = vi.fn(() => gameA);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(emitRoomA).toHaveBeenNthCalledWith(1, "player-left", {
      room: "room-a",
      id: "s1",
      hostId: "s2",
    });
    expect(emitRoomA).toHaveBeenNthCalledWith(2, "game-state", {
      room: "room-a",
      game: publicState,
    });
  });
});
