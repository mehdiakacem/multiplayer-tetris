import createBoard from "./createBoard.js";
import { describe, test, expect } from 'vitest';


describe("createBoard", () => {
  test("returns a 20x10 board", () => {
    const board = createBoard();

    expect(board).toHaveLength(20);
    board.forEach((row) => {
      expect(row).toHaveLength(10);
    });
  });

  test("initializes all cells to 0", () => {
    const board = createBoard();

    board.forEach((row) => {
      row.forEach((cell) => {
        expect(cell).toBe(0);
      });
    });
  });

  test("creates independent rows (no shared references)", () => {
    const board = createBoard();

    board[0][0] = 1;
    expect(board[1][0]).toBe(0);
  });
});
