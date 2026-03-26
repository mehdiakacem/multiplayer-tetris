import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGameSocketMiddleware } from "./gameSocketMiddleware";

describe("gameSocketMiddleware - Basic Tests", () => {
  // We'll create a fake socket before each test
  let fakeSocket;
  let middleware;

  beforeEach(() => {
    // Create a fake socket with fake methods
    // vi.fn() creates a "spy" function that remembers when it's called
    fakeSocket = {
      emit: vi.fn(),           // fake emit method
      on: vi.fn(),             // fake on method
      off: vi.fn(),            // fake off method
      connect: vi.fn(),        // fake connect method
      disconnect: vi.fn(),     // fake disconnect method
      removeAllListeners: vi.fn(), // fake removeAllListeners method
      id: "test-socket-123",   // fake socket ID
      connected: true,         // fake connection status
    };

    // Create middleware with our fake socket
    middleware = createGameSocketMiddleware(fakeSocket);
  });

  // TEST 1: Can we join a room?
  it("should join a room when joinRoom is called", () => {
    // Do the action
    middleware.joinRoom("myRoom", "Alice");

    // Check if socket.emit was called correctly
    expect(fakeSocket.emit).toHaveBeenCalledWith("join-room", {
      room: "myRoom",
      playerName: "Alice",
    });
  });

  // TEST 2: Can we start the game?
  it("should start game when startGame is called", () => {
    // Do the action
    middleware.startGame();

    // Check if socket.emit was called
    expect(fakeSocket.emit).toHaveBeenCalledWith("start-game");
  });

  // TEST 3: Can we send player input?
  it("should send player input when sendPlayerInput is called", () => {
    // Do the action
    middleware.sendPlayerInput("left");

    // Check if socket.emit was called with correct data
    expect(fakeSocket.emit).toHaveBeenCalledWith("player-input", {
      action: "left",
    });
  });

  it("should send player input with client action id when provided", () => {
    middleware.sendPlayerInput("left", 42);

    expect(fakeSocket.emit).toHaveBeenCalledWith("player-input", {
      action: "left",
      clientActionId: 42,
    });
  });

  // TEST 4: Can we listen to events?
  it("should register event listener when on is called", () => {
    // Create a fake callback function
    const myCallback = vi.fn();

    // Register the listener
    middleware.on("game-started", myCallback);

    // Check if socket.on was called
    expect(fakeSocket.on).toHaveBeenCalledWith("game-started", myCallback);
  });

  // TEST 5: Can we connect?
  it("should connect when connect is called", () => {
    // Do the action
    middleware.connect();

    // Check if socket.connect was called
    expect(fakeSocket.connect).toHaveBeenCalled();
  });

  // TEST 6: Can we disconnect?
  it("should disconnect when disconnect is called", () => {
    // Do the action
    middleware.disconnect();

    // Check if socket.disconnect was called
    expect(fakeSocket.disconnect).toHaveBeenCalled();
  });

  // TEST 7: Can we get the socket ID?
  it("should return socket ID when getId is called", () => {
    // Get the ID
    const id = middleware.getId();

    // Check if it matches our fake socket ID
    expect(id).toBe("test-socket-123");
  });

  // TEST 8: Can we check if connected?
  it("should return connection status when isConnected is called", () => {
    // Get connection status
    const connected = middleware.isConnected();

    // Check if it's true (our fake socket is connected)
    expect(connected).toBe(true);
  });

  // TEST 9: Does cleanup work?
  it("should clean up and disconnect when cleanup is called", () => {
    // Do the action
    middleware.cleanup();

    // Check if both methods were called
    expect(fakeSocket.removeAllListeners).toHaveBeenCalled();
    expect(fakeSocket.disconnect).toHaveBeenCalled();
  });

  // TEST 10: Can we remove a specific listener?
  it("should remove listener when off is called", () => {
    // Create a fake callback
    const myCallback = vi.fn();

    // First, add the listener
    middleware.on("some-event", myCallback);

    // Now remove it
    middleware.off("some-event", myCallback);

    // Check if socket.off was called
    expect(fakeSocket.off).toHaveBeenCalledWith("some-event", myCallback);
  });
});
