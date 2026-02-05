import GameManager from "./GameManager.js";
import Game from "./Game.js";
import { describe, test, expect, beforeEach } from 'vitest';


describe("GameManager", () => {
  let manager;

  beforeEach(() => {
    manager = new GameManager();
  });

  test("initially has no games", () => {
    expect(manager.getAllGames()).toEqual([]);
  });

  test("createGame creates and stores a game", () => {
    const game = manager.createGame("room1");

    expect(game).toBeInstanceOf(Game);
    expect(manager.hasGame("room1")).toBe(true);
    expect(manager.getGame("room1")).toBe(game);
  });

  test("getOrCreateGame creates a game if it does not exist", () => {
    const game = manager.getOrCreateGame("room1");

    expect(manager.hasGame("room1")).toBe(true);
    expect(game).toBe(manager.getGame("room1"));
  });

  test("getOrCreateGame returns existing game if already created", () => {
    const first = manager.getOrCreateGame("room1");
    const second = manager.getOrCreateGame("room1");

    expect(first).toBe(second);
  });

  test("removeGame removes a game", () => {
    manager.createGame("room1");
    manager.removeGame("room1");

    expect(manager.hasGame("room1")).toBe(false);
  });

  test("getAllGames returns all created games", () => {
    const game1 = manager.createGame("room1");
    const game2 = manager.createGame("room2");

    const games = manager.getAllGames();

    expect(games).toContain(game1);
    expect(games).toContain(game2);
    expect(games).toHaveLength(2);
  });
});
