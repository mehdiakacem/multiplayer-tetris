import Game from "./Game.js";

export default class GameManager {
  constructor() {
    this.games = new Map();
  }

  hasGame(room) {
    return this.games.has(room);
  }

  getGame(room) {
    return this.games.get(room);
  }

  createGame(room) {
    const game = new Game(room);
    this.games.set(room, game);
    return game;
  }

  getOrCreateGame(room) {
    if (!this.hasGame(room)) {
      return this.createGame(room);
    }
    return this.getGame(room);
  }

  removeGame(room) {
    this.games.delete(room);
  }

  getAllGames() {
    return [...this.games.values()];
  }
}
