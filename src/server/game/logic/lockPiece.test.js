import lockPiece from "./lockPiece.js";
import { describe, test, expect } from 'vitest';

describe("lockPiece", () => {
  test("locks a piece matrix onto the board at the correct position", () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const piece = {
      type: 1,
      matrix: [
        [1, 1],
        [1, 1],
      ],
      position: { x: 1, y: 1 },
    };

    const result = lockPiece(board, piece);

    expect(result).toEqual([
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ]);
  });

  test("does not mutate the original board", () => {
    const board = [
      [0, 0],
      [0, 0],
    ];

    const piece = {
      type: 2,
      matrix: [[1]],
      position: { x: 0, y: 0 },
    };

    const boardCopy = board.map((row) => [...row]);

    lockPiece(board, piece);

    expect(board).toEqual(boardCopy);
  });

  test("ignores zero cells in the piece matrix", () => {
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const piece = {
      type: 3,
      matrix: [
        [1, 0],
        [0, 1],
      ],
      position: { x: 0, y: 0 },
    };

    const result = lockPiece(board, piece);

    expect(result).toEqual([
      [3, 0, 0],
      [0, 3, 0],
      [0, 0, 0],
    ]);
  });
});
