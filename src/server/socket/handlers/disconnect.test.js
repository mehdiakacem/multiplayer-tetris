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
      players: new Map([["someone-else", {}]]),
      removePlayer: vi.fn(),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.removePlayer).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
    expect(gameManager.removeGame).not.toHaveBeenCalled();
  });

  it("removes player and emits player-left when socket is in a game", () => {
    const gameA = {
      room: "room-a",
      hostId: "h1",
      players: new Map([["s1", {}]]),
      removePlayer: vi.fn(),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.removePlayer).toHaveBeenCalledWith("s1");

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
      players: new Map([["s1", {}]]),
      removePlayer: vi.fn(),
      isEmpty: vi.fn(() => true), // 👈 empty now
    };

    gameManager.getAllGames = vi.fn(() => [gameA]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.removePlayer).toHaveBeenCalledWith("s1");
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
      players: new Map([["s1", {}]]),
      removePlayer: vi.fn(),
      isEmpty: vi.fn(() => false),
    };

    const gameB = {
      room: "room-b",
      hostId: "h2",
      players: new Map([["s1", {}]]),
      removePlayer: vi.fn(),
      isEmpty: vi.fn(() => false),
    };

    gameManager.getAllGames = vi.fn(() => [gameA, gameB]);

    const handler = handleDisconnect({ socket, io, gameManager });
    handler();

    expect(gameA.removePlayer).toHaveBeenCalledWith("s1");
    expect(gameB.removePlayer).toHaveBeenCalledWith("s1");

    expect(emitA).toHaveBeenCalledWith("player-left", { id: "s1", hostId: "h1" });
    expect(emitB).toHaveBeenCalledWith("player-left", { id: "s1", hostId: "h2" });
  });
});
