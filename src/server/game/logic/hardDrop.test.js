import hardDrop from "./hardDrop.js";
import isValidPosition from "./isValidPosition.js";
import { describe, test, expect } from 'vitest';


describe("hardDrop", () => {
  const createBoard = (rows = 20, cols = 10) => {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  };

  const createPiece = (matrix, x, y, type = "T") => ({
    type,
    rotation: 0,
    matrix,
    position: { x, y },
    clone() {
      return createPiece(
        matrix.map((row) => [...row]),
        this.position.x,
        this.position.y,
        type,
      );
    },
  });

  describe("Basic hard drop behavior", () => {
    test("drops piece to bottom of empty board", () => {
      const board = createBoard();
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        4,
        0,
      );

      const dropped = hardDrop(board, piece, isValidPosition);

      expect(dropped.position.y).toBe(18); // Should land at row 18 (20 - 2)
      expect(dropped.position.x).toBe(4); // X position unchanged
    });
  });
});
