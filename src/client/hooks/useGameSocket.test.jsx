import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGameSocket } from "./useGameSocket";

const fakeMiddleware = {
  connect: vi.fn(),
  joinRoom: vi.fn(),
  on: vi.fn(),
  cleanup: vi.fn(),
  getId: vi.fn(() => "s1"),
  sendPlayerInput: vi.fn(),
};

vi.mock("../socket", () => ({
  socket: {},
}));

vi.mock("../middleware/gameSocketMiddleware", () => ({
  createGameSocketMiddleware: vi.fn(() => fakeMiddleware),
}));

function TestComponent({ room, playerName }) {
  const { status, opponents, hostId, game, player, sendPlayerInput } = useGameSocket({
    room,
    playerName,
  });

  return (
    <div>
      <span data-testid="status">{status ?? "null"}</span>
      <span data-testid="hostId">{hostId ?? "null"}</span>
      <span data-testid="opponents">{opponents.map((player) => player.name).join(",")}</span>
      <span data-testid="game-room">{game?.room ?? "null"}</span>
      <span data-testid="player-x">{player?.currentPiece?.position?.x ?? "null"}</span>
      <button onClick={() => sendPlayerInput("right")}>move-right</button>
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
    fakeMiddleware.sendPlayerInput.mockClear();
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
      expect(screen.getByTestId("player-x")).toHaveTextContent("null");
    });
  });

  it("keeps local movement responsive while authoritative snapshots catch up", async () => {
    render(<TestComponent room="room-1" playerName="Alice" />);

    const handlers = new Map(
      fakeMiddleware.on.mock.calls.map(([event, handler]) => [event, handler]),
    );

    act(() => {
      handlers.get("game-started")({
        room: "room-1",
        game: {
          room: "room-1",
          ended: false,
          hostId: "s1",
          players: [
            {
              id: "s1",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: {
                type: "T",
                rotation: 0,
                position: { x: 4, y: 0 },
                matrix: [
                  [0, 1, 0],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
              },
            },
            {
              id: "s2",
              name: "Bob",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: null,
            },
          ],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("player-x")).toHaveTextContent("4");
    });

    act(() => {
      fireEvent.click(screen.getByText("move-right"));
      fireEvent.click(screen.getByText("move-right"));
    });

    expect(fakeMiddleware.sendPlayerInput).toHaveBeenNthCalledWith(1, "right", 1);
    expect(fakeMiddleware.sendPlayerInput).toHaveBeenNthCalledWith(2, "right", 2);
    expect(screen.getByTestId("player-x")).toHaveTextContent("6");

    act(() => {
      handlers.get("input-ack")({ actionId: 1 });
    });

    act(() => {
      handlers.get("game-state")({
        room: "room-1",
        game: {
          room: "room-1",
          ended: false,
          hostId: "s1",
          players: [
            {
              id: "s1",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: {
                type: "T",
                rotation: 0,
                position: { x: 5, y: 0 },
                matrix: [
                  [0, 1, 0],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
              },
            },
            {
              id: "s2",
              name: "Bob",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: null,
            },
          ],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("player-x")).toHaveTextContent("6");
      expect(screen.getByTestId("opponents")).toHaveTextContent("Bob");
    });

    act(() => {
      handlers.get("input-ack")({ actionId: 2 });
    });

    act(() => {
      handlers.get("game-state")({
        room: "room-1",
        game: {
          room: "room-1",
          ended: false,
          hostId: "s1",
          players: [
            {
              id: "s1",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: {
                type: "T",
                rotation: 0,
                position: { x: 6, y: 0 },
                matrix: [
                  [0, 1, 0],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
              },
            },
            {
              id: "s2",
              name: "Bob",
              alive: true,
              board: Array.from({ length: 20 }, () => Array(10).fill(0)),
              currentPiece: null,
            },
          ],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("player-x")).toHaveTextContent("6");
    });
  });
});
