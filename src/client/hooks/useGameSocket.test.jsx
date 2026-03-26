import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGameSocket } from "./useGameSocket";

const fakeMiddleware = {
  connect: vi.fn(),
  joinRoom: vi.fn(),
  on: vi.fn(),
  cleanup: vi.fn(),
  getId: vi.fn(() => "s1"),
};

vi.mock("../socket", () => ({
  socket: {},
}));

vi.mock("../middleware/gameSocketMiddleware", () => ({
  createGameSocketMiddleware: vi.fn(() => fakeMiddleware),
}));

function TestComponent({ room, playerName }) {
  const { status, opponents, hostId, game } = useGameSocket({ room, playerName });

  return (
    <div>
      <span data-testid="status">{status ?? "null"}</span>
      <span data-testid="hostId">{hostId ?? "null"}</span>
      <span data-testid="opponents">{opponents.map((player) => player.name).join(",")}</span>
      <span data-testid="game-room">{game?.room ?? "null"}</span>
    </div>
  );
}

describe("useGameSocket", () => {
  beforeEach(() => {
    fakeMiddleware.connect.mockClear();
    fakeMiddleware.joinRoom.mockClear();
    fakeMiddleware.on.mockClear();
    fakeMiddleware.cleanup.mockClear();
    fakeMiddleware.getId.mockClear();
    fakeMiddleware.getId.mockReturnValue("s1");
  });

  it("ignores room events that do not match the current route room", async () => {
    render(<TestComponent room="room-2" playerName="Alice" />);

    const handlers = new Map(fakeMiddleware.on.mock.calls.map(([event, handler]) => [event, handler]));

    handlers.get("player-joined")({
      room: "room-1",
      players: [
        { id: "s1", name: "Alice" },
        { id: "s2", name: "Bob" },
      ],
      hostId: "s1",
    });

    handlers.get("game-started")({
      room: "room-1",
      game: {
        room: "room-1",
        ended: false,
        hostId: "s1",
        players: [{ id: "s1", alive: true }],
      },
    });

    handlers.get("game-state")({
      room: "room-1",
      game: {
        room: "room-1",
        ended: false,
        hostId: "s1",
        players: [{ id: "s1", alive: true }],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("null");
      expect(screen.getByTestId("hostId")).toHaveTextContent("null");
      expect(screen.getByTestId("opponents")).toHaveTextContent("");
      expect(screen.getByTestId("game-room")).toHaveTextContent("null");
    });
  });
});
