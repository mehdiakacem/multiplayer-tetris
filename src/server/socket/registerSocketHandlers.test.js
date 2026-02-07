import { describe, it, expect, vi } from "vitest";
import { registerSocketHandlers } from "./registerSocketHandlers.js";

describe("registerSocketHandlers wiring", () => {
  it("registers all socket event handlers on connection", () => {
    // fake socket
    const socket = {
      on: vi.fn(),
    };

    // fake io
    const io = {
      on: vi.fn((event, callback) => {
        // simulate a client connecting
        if (event === "connection") {
          callback(socket);
        }
      }),
    };

    const gameManager = {};

    registerSocketHandlers(io, gameManager);

    // collect registered socket events
    const events = socket.on.mock.calls.map((call) => call[0]);

    expect(events).toEqual(
      expect.arrayContaining([
        "join-room",
        "start-game",
        "player-input",
        "disconnect",
      ]),
    );
  });
});
