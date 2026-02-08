import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Board from "./Board";

describe("Board", () => {
  it("renders empty board when no board prop provided", () => {
    const { container } = render(<Board board={null} activePiece={null} />);

    const board = container.querySelector(".board");
    expect(board).toBeInTheDocument();
    expect(board.children.length).toBe(0);
  });

  it("renders cells for each item in board", () => {
    const mockBoard = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];

    const { container } = render(
      <Board board={mockBoard} activePiece={null} />,
    );

    const cells = container.querySelectorAll(".cell");
    expect(cells.length).toBe(9); // 3x3 = 9 cells
  });

  it("applies correct color class for board cells", () => {
    const mockBoard = [
      ["I", "O"],
      ["T", 0],
    ];

    const { container } = render(
      <Board board={mockBoard} activePiece={null} />,
    );

    const cells = container.querySelectorAll(".cell");
    expect(cells[0]).toHaveClass("cyan"); // I piece
    expect(cells[1]).toHaveClass("yellow"); // O piece
    expect(cells[2]).toHaveClass("purple"); // T piece
    expect(cells[3]).toHaveClass("empty"); // empty cell (0)
  });

  it("applies active piece color to active cells", () => {
    const mockBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const mockActivePiece = {
      type: "I",
      position: { x: 1, y: 1 },
      matrix: [
        [1, 1, 1, 1], // I piece horizontal line
      ],
    };

    const { container } = render(
      <Board board={mockBoard} activePiece={mockActivePiece} />,
    );

    const cells = container.querySelectorAll(".cell");
    // Cell at position (1,1) should be cyan (I piece)
    expect(cells[4]).toHaveClass("cyan");
  });

  it("handles undefined activePiece", () => {
    const mockBoard = [["I"], ["O"]];

    const { container } = render(
      <Board board={mockBoard} activePiece={undefined} />,
    );

    const cells = container.querySelectorAll(".cell");
    expect(cells[0]).toHaveClass("cyan"); // I piece
    expect(cells[1]).toHaveClass("yellow"); // O piece
  });

  it("renders board container with correct class", () => {
    const mockBoard = [[0]];

    const { container } = render(
      <Board board={mockBoard} activePiece={null} />,
    );

    expect(container.querySelector(".board")).toBeInTheDocument();
  });
});
