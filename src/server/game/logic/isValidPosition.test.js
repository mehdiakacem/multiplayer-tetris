import isValidPosition from "./isValidPosition.js";
import { describe, test, expect, beforeEach } from 'vitest';

describe("isValidPosition", () => {
  let emptyBoard;

  beforeEach(() => {
    emptyBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
  });

  const createPiece = (matrix, x, y) => ({
    matrix,
    position: { x, y },
  });

  describe("Basic valid positoins", () => {
    test("retruns true for valid position on empty board", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        0,
        0,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });

    test("returns true for piece in center", () => {
      const piece = createPiece(
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        3,
        8,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });
  });

  describe("Horizontal boundaries", () => {
    test("rejects piece off left edge", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        -1,
        5,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(false);
    });

    test("rejects piece off right edge", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        9,
        5,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(false);
    });

    test("accepts piece at exact left boundary", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        0,
        5,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });

    test("accepts piece at exact right boundary", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        8,
        5,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });
  });

  describe("Vertical boundaries", () => {
    test("rejects piece below bottom edge", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        4,
        19,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(false);
    });

    test("accepts piece at exact bottom boundary", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        4,
        18,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });

    test("allows piece above screen (spawn position)", () => {
      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        4,
        -1,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });

    test("allows piece partially above screen", () => {
      const piece = createPiece(
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        4,
        -2,
      );

      expect(isValidPosition(emptyBoard, piece)).toBe(true);
    });
  });

  describe("Collision with existing blocks", () => {
    test("detects collision with single block", () => {
      const board = Array.from({ length: 20 }, () => Array(10).fill(0));
      board[10][5] = 1;

      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        4,
        9,
      );

      expect(isValidPosition(board, piece)).toBe(false);
    });

    test("detects collision with bottom pile", () => {
      const board = Array.from({ length: 20 }, () => Array(10).fill(0));
      for (let col = 0; col < 10; col++) {
        board[19][col] = 1;
      }

      const piece = createPiece(
        [
          [1, 1],
          [1, 1],
        ],
        0,
        18,
      );

      expect(isValidPosition(board, piece)).toBe(false);
    });
  });
});
