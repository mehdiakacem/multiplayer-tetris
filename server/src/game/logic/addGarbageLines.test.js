import { addGarbageLines } from "./addGarbageLines.js";

describe("addGarbageLines", () => {
  const emptyRow = Array(10).fill(0);

  const createBoard = (rows = 20) =>
    Array.from({ length: rows }, () => [...emptyRow]);

  test("adds one garbage line at the bottom", () => {
    const board = createBoard(4);

    const result = addGarbageLines(board, 1);

    expect(result).toHaveLength(4);
    expect(result[result.length - 1]).toEqual(Array(10).fill("X"));
  });

  test("adds multiple garbage lines", () => {
    const board = createBoard(5);

    const result = addGarbageLines(board, 2);

    expect(result.slice(-2)).toEqual([
      Array(10).fill("X"),
      Array(10).fill("X"),
    ]);
  });

  test("does not mutate the original board", () => {
    const board = createBoard(3);
    const boardCopy = board.map((row) => [...row]);

    addGarbageLines(board, 1);

    expect(board).toEqual(boardCopy);
  });

  test("returns an unchanged board when count is 0", () => {
    const board = createBoard(3);

    const result = addGarbageLines(board, 0);

    expect(result).toEqual(board);
    expect(result).not.toBe(board); // still cloned
  });
});
