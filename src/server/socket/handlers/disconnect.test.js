import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleDisconnect } from "../handlers/disconnect.js";

describe("handleDisconnect", () => {
  let socket, io, emit, gameManager;

  beforeEach(() => {
    socket = { id: "s1" };

    emit = vi.fn();
    io = {
      to: vi.fn(() => ({ emit })),
    };

    gameManager = {
      getAllGames: vi.fn(() => []),
      removeGame: vi.fn(),
    };
  });

  it("does nothing if socket is not in any game", () => {
    const gameA = {
      room: "room-a",
      hostId: "h1",
      handlePlayerDisconnect: vi.fn(() => false),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");
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

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");

    expect(io.to).toHaveBeenCalledWith("room-a");
    expect(emit).toHaveBeenCalledWith("player-left", {
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

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");
    expect(gameManager.removeGame).toHaveBeenCalledWith("room-a");
  });

  it("handles multiple games containing the socket id", () => {
    const emitA = vi.fn();
    const emitB = vi.fn();

    io.to = vi.fn((room) => {
      if (room === "room-a") return { emit: emitA };
      if (room === "room-b") return { emit: emitB };
      return { emit: vi.fn() };
    });

    const gameA = {
      room: "room-a",
      hostId: "h1",
      started: false,
      ended: false,
      handlePlayerDisconnect: vi.fn(() => true),
      isEmpty: vi.fn(() => false),
    };

    const gameB = {
      room: "room-b",
      hostId: "h2",
      started: false,
      ended: false,
      handlePlayerDisconnect: vi.fn(() => true),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getAllGames = vi.fn(() => [gameA, gameB]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.handlePlayerDisconnect).toHaveBeenCalledWith("s1");
    expect(gameB.handlePlayerDisconnect).toHaveBeenCalledWith("s1");

    expect(emitA).toHaveBeenCalledWith("player-left", { id: "s1", hostId: "h1" });
    expect(emitB).toHaveBeenCalledWith("player-left", { id: "s1", hostId: "h2" });
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

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(emitRoomA).toHaveBeenNthCalledWith(1, "player-left", {
      id: "s1",
      hostId: "s2",
    });
    expect(emitRoomA).toHaveBeenNthCalledWith(2, "game-state", {
      game: publicState,
    });
  });
});
