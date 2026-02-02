import clearLines from "./clearLines.js";

describe("clearLines", () => {
  const createBoard = (rows = 20, cols = 10) => {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  };

  describe("No lines to clear", () => {
    test("returns original board when no lines are full", () => {
      const board = createBoard();

      const result = clearLines(board);

      expect(result.linesCleared).toBe(0);
      expect(result.newBoard).toEqual(board);
    });
  });

  describe("Single line clearing", () => {
    test("clears bottom line when full", () => {
      const board = createBoard();
      board[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full bottom line

      const result = clearLines(board);

      expect(result.linesCleared).toBe(1);
      expect(result.newBoard[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.newBoard[19]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    test("clears middle line and shifts blocks down", () => {
      const board = createBoard();
      board[17] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]; // Full line in middle
      board[16] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // Line above

      const result = clearLines(board);

      expect(result.linesCleared).toBe(1);
      expect(result.newBoard[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.newBoard[17]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
    });

    test("clears top line", () => {
      const board = createBoard();
      board[0] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full top line

      const result = clearLines(board);

      expect(result.linesCleared).toBe(1);
      expect(result.newBoard[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe("Multiple line clearing", () => {
    test("clears two consecutive lines", () => {
      const board = createBoard();
      board[18] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      board[19] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

      const result = clearLines(board);

      expect(result.linesCleared).toBe(2);
      expect(result.newBoard[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.newBoard[1]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    test("clears three non-consecutive lines", () => {
      const board = createBoard();
      board[15] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full
      board[16] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // Partial
      board[17] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]; // Full
      board[18] = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // Partial
      board[19] = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]; // Full

      const result = clearLines(board);

      expect(result.linesCleared).toBe(3);
      expect(result.newBoard[18]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      expect(result.newBoard[19]).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
    });

    test("clears four lines (Tetris)", () => {
      const board = createBoard();
      board[16] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      board[17] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
      board[18] = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      board[19] = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

      const result = clearLines(board);

      expect(result.linesCleared).toBe(4);
      expect(
        result.newBoard
          .slice(0, 4)
          .every((row) => row.every((cell) => cell === 0)),
      ).toBe(true);
    });
  });

  describe("Line shifting behavior", () => {
    test("shifts remaining blocks down correctly after clearing", () => {
      const board = createBoard();
      board[15] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      board[16] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      board[17] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      board[18] = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; // Full - will be cleared
      board[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full - will be cleared

      const result = clearLines(board);

      expect(result.linesCleared).toBe(2);
      expect(result.newBoard[17]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      expect(result.newBoard[18]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      expect(result.newBoard[19]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
    });

    test("maintains block order after multiple clears", () => {
      const board = createBoard();
      board[10] = [7, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Top block
      board[15] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full - cleared
      board[16] = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Middle block
      board[19] = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]; // Full - cleared

      const result = clearLines(board);

      expect(result.linesCleared).toBe(2);
      expect(result.newBoard[12]).toEqual([7, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.newBoard[17]).toEqual([8, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe("Garbage line handling (penalty lines marked with 'X')", () => {
    test("does not clear garbage lines even if full", () => {
      const board = createBoard();
      board[19] = ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]; // Full garbage line

      const result = clearLines(board);

      expect(result.linesCleared).toBe(0);
      expect(result.newBoard[19]).toEqual([
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
      ]);
    });

    test("clears regular lines but keeps garbage lines", () => {
      const board = createBoard();
      board[18] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Full regular line
      board[19] = ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]; // Full garbage line

      const result = clearLines(board);

      expect(result.linesCleared).toBe(1);
      expect(result.newBoard[19]).toEqual([
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
      ]);
    });

    test("handles mixed garbage and regular full lines", () => {
      const board = createBoard();
      board[17] = ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]; // Garbage
      board[18] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Regular full
      board[19] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]; // Regular full

      const result = clearLines(board);

      expect(result.linesCleared).toBe(2);
      expect(result.newBoard[19]).toEqual([
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
      ]);
    });
  });
});
