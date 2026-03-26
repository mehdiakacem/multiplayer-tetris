import { describe, it, expect, vi } from "vitest";
import { handleJoinRoom } from "../handlers/joinRoom";

describe("handleJoinRoom", () => {
  it("rejects a missing payload", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = { to: vi.fn() };
    const gameManager = {
      getGame: vi.fn(),
      createGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })(undefined);

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.createGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("rejects malformed payload fields", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = { to: vi.fn() };
    const gameManager = {
      getGame: vi.fn(),
      createGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: 42,
      playerName: "",
    });

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.createGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("joins room and emits player-joined", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
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
      getGame: vi.fn(() => undefined),
      createGame: vi.fn(() => game),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "room-1",
      playerName: "Alice",
    });

    expect(socket.join).toHaveBeenCalledWith("room-1");
    expect(socket.data.room).toBe("room-1");
    expect(emit).toHaveBeenCalledWith("player-joined", {
      room: "room-1",
      players: [{ id: "s1", name: "Alice" }],
      hostId: "s1",
    });
  });

  it("leaves the previous room and removes the socket from its old game before joining a new room", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
      emit: vi.fn(),
      data: { room: "room-1" },
    };

    const emitOldRoom = vi.fn();
    const emitNewRoom = vi.fn();
    const io = {
      to: vi.fn((room) => {
        if (room === "room-1") return { emit: emitOldRoom };
        if (room === "room-2") return { emit: emitNewRoom };
        return { emit: vi.fn() };
      }),
    };

    const oldGame = {
      room: "room-1",
      hostId: "s2",
      started: false,
      ended: false,
      handlePlayerDisconnect: vi.fn(() => true),
      isEmpty: vi.fn(() => false),
    };

    const newGame = {
      room: "room-2",
      started: false,
      hostId: "s1",
      addPlayer: vi.fn(),
      getPublicState: () => ({
        players: [{ id: "s1", name: "Alice" }],
      }),
    };

    const gameManager = {
      getGame: vi.fn((room) => (room === "room-1" ? oldGame : undefined)),
      createGame: vi.fn(() => newGame),
      removeGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "room-2",
      playerName: "Alice",
    });

    expect(socket.leave).toHaveBeenCalledWith("room-1");
    expect(oldGame.handlePlayerDisconnect).toHaveBeenCalledWith("s1");
    expect(emitOldRoom).toHaveBeenCalledWith("player-left", {
      room: "room-1",
      id: "s1",
      hostId: "s2",
    });
    expect(socket.join).toHaveBeenCalledWith("room-2");
    expect(socket.data.room).toBe("room-2");
    expect(emitNewRoom).toHaveBeenCalledWith("player-joined", {
      room: "room-2",
      players: [{ id: "s1", name: "Alice" }],
      hostId: "s1",
    });
  });
});

describe("handleJoinRoom - deny join", () => {
  it("rejects empty room or player names", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
      emit: vi.fn(),
      data: {},
    };

    const io = {
      to: vi.fn(),
    };

    const gameManager = {
      getGame: vi.fn(),
      createGame: vi.fn(),
    };

    handleJoinRoom({ socket, io, gameManager })({
      room: "   ",
      playerName: "Alice",
    });

    expect(socket.emit).toHaveBeenCalledWith("join-denied", {
      reason: "Invalid room or player name",
    });
    expect(gameManager.createGame).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("emits join-denied if game already started", () => {
    const socket = {
      id: "s1",
      join: vi.fn(),
      leave: vi.fn(),
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
      getGame: vi.fn(() => game),
      createGame: vi.fn(),
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
