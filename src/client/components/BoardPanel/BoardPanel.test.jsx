import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BoardPanel from "./BoardPanel";

// Mock Board: show a simple div + expose received props in the DOM
vi.mock("../Board/Board", () => ({
  default: ({ board, activePiece }) => (
    <div data-testid="board">
      board:{board ? "yes" : "no"} piece:{activePiece ? "yes" : "no"}
    </div>
  ),
}));

// Mock Overlay: show a simple div + expose received props in the DOM
vi.mock("../Overlay/Overlay", () => ({
  default: ({ status, isHost, game }) => (
    <div data-testid="overlay">
      status:{String(status)} host:{String(isHost)} game:{game ? "yes" : "no"}
    </div>
  ),
}));

describe("BoardPanel", () => {
  it("renders Board and Overlay", () => {
    render(
      <BoardPanel
        player={{ board: [[0]], currentPiece: { type: "I" } }}
        status="WAITING"
        isHost={true}
        onStart={vi.fn()}
        game={{ room: "abc" }}
      />
    );

    expect(screen.getByTestId("board")).toBeInTheDocument();
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });

  it("handles missing player safely (player?.)", () => {
    render(
      <BoardPanel
        player={null}
        status="WAITING"
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    // still renders because BoardPanel always renders Board + Overlay
    expect(screen.getByTestId("board")).toHaveTextContent("board:no");
    expect(screen.getByTestId("overlay")).toHaveTextContent("game:no");
  });
});
