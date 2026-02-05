import computeSpectrum from "./computeSpectrum.js";
import { describe, test, expect } from 'vitest';


const emptyBoard = () => Array.from({ length: 20 }, () => Array(10).fill(0));

test("returns all zeros for an empty board", () => {
  const board = emptyBoard();

  const spectrum = computeSpectrum(board);

  expect(spectrum).toEqual(Array(10).fill(0));
});

test("computes height for a single block", () => {
  const board = emptyBoard();
  board[19][0] = 1; // bottom of column 0

  const spectrum = computeSpectrum(board);

  expect(spectrum[0]).toBe(1);
});

test("computes correct height when block is higher", () => {
  const board = emptyBoard();
  board[15][2] = 1; // row 15 → height = 20 - 15 = 5

  const spectrum = computeSpectrum(board);

  expect(spectrum[2]).toBe(5);
});

test("computes spectrum for multiple columns", () => {
  const board = emptyBoard();

  board[19][0] = 1; // height 1
  board[17][1] = 1; // height 3
  board[10][2] = 1; // height 10

  const spectrum = computeSpectrum(board);

  expect(spectrum).toEqual([1, 3, 10, 0, 0, 0, 0, 0, 0, 0]);
});
