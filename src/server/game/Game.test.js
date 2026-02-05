import Game from "./Game.js";
import Player from "./Player.js";
import createBoard from "./logic/createBoard.js";
import isValidPosition from "./logic/isValidPosition.js";
import move from "./logic/move.js";
import { describe, test, expect, beforeEach } from 'vitest';

describe("Game", () => {
  let game;
  let player1;
  let player2;

  beforeEach(() => {
    game = new Game("room-1");

    player1 = new Player("p1", "Alice");
    player2 = new Player("p2", "Bob");

    game.addPlayer(player1);
    game.addPlayer(player2);
  });

  describe("player management", () => {
    test("first player becomes host", () => {
      expect(game.hostId).toBe("p1");
    });

    test("removing host assigns new host", () => {
      game.removePlayer("p1");
      expect(game.hostId).toBe("p2");
    });

    test("game is empty when all players removed", () => {
      game.removePlayer("p1");
      game.removePlayer("p2");
      expect(game.isEmpty()).toBe(true);
    });
  });

  describe("startGame", () => {
    test("only host can start the game", () => {
      expect(game.startGame("p2")).toBe(false);
      expect(game.started).toBe(false);
    });

    test("host can start the game", () => {
      const result = game.startGame("p1");
      expect(result).toBe(true);
      expect(game.started).toBe(true);
    });

    test("players are reset on game start", () => {
      player1.pendingPenaltyLines = 3;
      player1.kill();

      game.startGame("p1");

      expect(player1.alive).toBe(true);
      expect(player1.pendingPenaltyLines).toBe(0);
      expect(player1.board).toEqual(createBoard());
    });
  });

  describe("spawnPieceForAll", () => {
    test("gives a piece to alive players", () => {
      game.startGame("p1");

      expect(player1.currentPiece).not.toBeNull();
      expect(player2.currentPiece).not.toBeNull();
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      game.startGame("p1");
    });

    test("ignores input if player is dead", () => {
      player1.kill();
      const pieceBefore = player1.currentPiece;

      game.handleInput("p1", "left");

      expect(player1.currentPiece).toBe(pieceBefore);
    });

    test("moves piece when action is valid", () => {
      const pieceBefore = player1.currentPiece;

      game.handleInput("p1", "left");

      expect(player1.currentPiece).not.toBe(pieceBefore);
    });

    test("ignores unknown actions", () => {
      const pieceBefore = player1.currentPiece;

      game.handleInput("p1", "invalid-action");

      expect(player1.currentPiece).toBe(pieceBefore);
    });
  });

  describe("handleLineClear", () => {
    test("adds penalty lines to other players", () => {
      game.handleLineClear("p1", 3); // 2 penalty lines

      expect(player1.pendingPenaltyLines).toBe(0);
      expect(player2.pendingPenaltyLines).toBe(2);
    });

    test("does nothing if linesCleared <= 1", () => {
      game.handleLineClear("p1", 1);

      expect(player2.pendingPenaltyLines).toBe(0);
    });
  });

  describe("killPlayer", () => {
    test("kills the player", () => {
      game.killPlayer("p1");
      expect(player1.alive).toBe(false);
    });

    test("ends game when one or fewer players alive", () => {
      game.killPlayer("p1");
      expect(game.ended).toBe(true);
    });
  });

  describe("getPublicState", () => {
    test("returns safe public data", () => {
      const state = game.getPublicState();

      expect(state.room).toBe("room-1");
      expect(state.players.length).toBe(2);
      expect(state.players[0]).toHaveProperty("id");
      expect(state.players[0]).toHaveProperty("board");
      expect(state.players[0]).not.toHaveProperty("socket");
    });
  });
});

describe("Game.tick()", () => {
  let game;
  let player;

  beforeEach(() => {
    game = new Game("room-1");
    player = new Player("p1", "Alice");

    game.addPlayer(player);
    game.startGame("p1");
  });

  test("moves piece down when possible", () => {
    const pieceBefore = player.currentPiece;
    const yBefore = pieceBefore.position.y;

    game.tick();

    expect(player.currentPiece).not.toBeNull();
    expect(player.currentPiece.position.y).toBe(yBefore + 1);
  });

  test("locks piece when it cannot move down", () => {
    // force piece to bottom
    while (true) {
      const testPiece = move(player.currentPiece, 0, 1);

      if (!isValidPosition(player.board, testPiece)) {
        break;
      }

      player.setPiece(testPiece);
    }

    const pieceBefore = player.currentPiece;

    game.tick();

    // piece should be locked and replaced
    expect(player.currentPiece).not.toBe(pieceBefore);
    expect(player.currentPiece).not.toBeNull();
  });

  test("does nothing if game is not started", () => {
    game.started = false;

    const pieceBefore = player.currentPiece;

    game.tick();

    expect(player.currentPiece).toBe(pieceBefore);
  });

  test("does nothing if game has ended", () => {
    game.ended = true;

    const pieceBefore = player.currentPiece;

    game.tick();

    expect(player.currentPiece).toBe(pieceBefore);
  });

  test("ignores dead players", () => {
    player.kill();
    const pieceBefore = player.currentPiece;

    game.tick();

    expect(player.currentPiece).toBe(pieceBefore);
  });
});
