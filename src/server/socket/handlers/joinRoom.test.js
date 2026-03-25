import { describe, it, expect, vi } from "vitest";
import { handleJoinRoom } from "../handlers/joinRoom";

describe("handleJoinRoom", () => {
  it("rejects a missing payload", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = { to: vi.fn() };
    const gameManager = {
      getOrCreateGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })(undefined);

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.getOrCreateGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("rejects malformed payload fields", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = { to: vi.fn() };
    const gameManager = {
      getOrCreateGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: 42,
      playerName: "",
    });

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.getOrCreateGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("joins room and emits player-joined", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const emit = vi.fn();
    const io = { to: vi.fn(() => ({ emit })) };

    const game = {
      started: false,
      hostId: "s1",
      addPlayer: vi.fn(),
      getPublicState: () => ({
        players: [{ id: "s1", name: "Alice" }],
      }),
    };

    const gameManager = {
      getOrCreateGame: vi.fn(() => game),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "room-1",
      playerName: "Alice",
    });

    expect(socket.join).toHaveBeenCalledWith("room-1");
    expect(socket.data.room).toBe("room-1");
    expect(emit).toHaveBeenCalled();
  });
});

describe("handleJoinRoom - deny join", () => {
  it("rejects empty room or player names", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = {
      to: vi.fn(),
    };

    const gameManager = {
      getOrCreateGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "   ",
      playerName: "Alice",
    });

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.getOrCreateGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("emits join-denied if game already started", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = {
      to: vi.fn(),
    };

    const game = {
      started: true, 
    };

    const gameManager = {
      getOrCreateGame: vi.fn(() => game),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "room-1",
      playerName: "Alice",
    });

    
    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Game already started",
    });

    
    expect(socket.join).not.toHaveBeenCalled();

    
    expect(socket.data.room).toBeUndefined();
  });
});
