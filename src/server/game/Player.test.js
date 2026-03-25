import Player from "./Player.js";
import Piece from "./Piece.js";
import { describe, test, expect } from 'vitest';


describe("Player", () => {
  test("creates a player with default state", () => {
    const player = new Player("socket-1", "Mehdi");

    expect(player.id).toBe("socket-1");
    expect(player.name).toBe("Mehdi");
    expect(player.alive).toBe(true);

    // board comes from createBoard()
    expect(player.board).toHaveLength(20);
    expect(player.board[0]).toHaveLength(10);

    expect(player.currentPiece).toBe(null);
    expect(player.queue).toEqual([]);
    expect(player.nextPieceIndex).toBe(0);
    expect(player.pendingPenaltyLines).toBe(0);

    // spectrum computed from board
    expect(player.spectrum).toHaveLength(10);
  });

  test("givePiece spawns a real Piece", () => {
    const player = new Player("1", "Player");

    player.givePiece("T");

    expect(player.currentPiece).not.toBe(null);
    expect(player.currentPiece.type).toBe("T");
    expect(player.queue).toEqual([]);
  });

  test("givePiece queues pieces", () => {
    const player = new Player("1", "Player");

    player.givePiece("I");
    player.givePiece("O");

    expect(player.currentPiece.type).toBe("I");
    expect(player.queue).toEqual(["O"]);
  });

  test("clearPiece clears currentPiece", () => {
    const player = new Player("1", "Player");

    player.givePiece("Z");
    player.clearPiece();

    expect(player.currentPiece).toBe(null);
  });

  test("setBoard updates board and spectrum", () => {
    const player = new Player("1", "Player");

    const newBoard = Array.from({ length: 20 }, () => Array(10).fill(1));

    player.setBoard(newBoard);

    expect(player.board).toBe(newBoard);
    expect(player.spectrum.every((h) => h === 20)).toBe(true);
  });

  test("setPiece sets the current piece directly", () => {
    const player = new Player("1", "Player");
    const piece = new Piece("L");

    player.setPiece(piece);

    expect(player.currentPiece).toBe(piece);
    expect(player.currentPiece.type).toBe("L");
    expect(player.queue).toEqual([]);
  });

  test("penalty lines lifecycle", () => {
    const player = new Player("1", "Player");

    player.addPenaltyLines(3);
    player.addPenaltyLines(2);

    expect(player.pendingPenaltyLines).toBe(5);
    expect(player.consumePenaltyLines()).toBe(5);
    expect(player.pendingPenaltyLines).toBe(0);
  });

  test("kill and isAlive", () => {
    const player = new Player("1", "Player");

    expect(player.isAlive()).toBe(true);

    player.kill();

    expect(player.isAlive()).toBe(false);
  });

  test("reset restores gameplay state including piece progression", () => {
    const player = new Player("1", "Player");

    player.givePiece("S");
    player.givePiece("Z");
    player.nextPieceIndex = 3;
    player.addPenaltyLines(2);
    player.kill();

    player.reset();

    expect(player.alive).toBe(true);
    expect(player.currentPiece).toBe(null);
    expect(player.queue).toEqual([]);
    expect(player.nextPieceIndex).toBe(0);
    expect(player.pendingPenaltyLines).toBe(0);
  });

  test("toPublicData exposes only public info", () => {
    const player = new Player("1", "Player");

    player.givePiece("S");

    const data = player.toPublicData();

    expect(data).toMatchObject({
      id: "1",
      name: "Player",
      alive: true,
      board: player.board,
      spectrum: player.spectrum,
    });

    expect(data.currentPiece.type).toBe("S");
  });
});
