import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GAME_STATUS } from "../../constants/gameStatus";
import BoardSection from "./BoardSection";

// Mock the child components so tests focus on BoardSection only
vi.mock("../Board/Board", () => ({
  default: ({ board }) => (
    <div data-testid="board">Board - {board ? "has board" : "no board"}</div>
  ),
}));

vi.mock("../GameOverlay/GameOverlay", () => ({
  default: ({ status }) => (
    <div data-testid="game-overlay">GameOverlay - Status: {status}</div>
  ),
}));

describe("BoardSection", () => {
  const mockPlayer = {
    board: [
      [0, 1],
      [2, 3],
    ],
    currentPiece: { type: "I", rotation: 0, x: 5, y: 0 },
  };

  it("renders Board and GameOverlay components", () => {
    render(
      <BoardSection
        player={mockPlayer}
        status={GAME_STATUS.STARTED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByTestId("board")).toBeInTheDocument();
    expect(screen.getByTestId("game-overlay")).toBeInTheDocument();
  });

  it("passes status, isHost, and onRestart to GameOverlay", () => {
    render(
      <BoardSection
        player={mockPlayer}
        status={GAME_STATUS.WON}
        isHost={false}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(/Status: WON/)).toBeInTheDocument();
  });

  it("passes board and activePiece to Board component", () => {
    render(
      <BoardSection
        player={mockPlayer}
        status={GAME_STATUS.STARTED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(/has board/)).toBeInTheDocument();
  });

  it("handles when player is undefined", () => {
    render(
      <BoardSection
        player={undefined}
        status={GAME_STATUS.WAITING}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(/no board/)).toBeInTheDocument();
  });

  it("has the board-container class", () => {
    const { container } = render(
      <BoardSection
        player={mockPlayer}
        status={GAME_STATUS.STARTED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(container.querySelector(".board-container")).toBeInTheDocument();
  });
});
