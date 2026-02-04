import Piece from "./Piece.js";
import computeSpectrum from "./logic/computeSpectrum.js";
import createBoard from "./logic/createBoard.js";

export default class Player {
  constructor(socketId, name) {
    this.id = socketId;
    this.name = name;
    this.alive = true;

    this.board = createBoard();
    this.currentPiece = null;
    this.queue = [];

    this.pendingPenaltyLines = 0;
    this.spectrum = computeSpectrum(this.board);
  }

  reset() {
    this.alive = true;
    this.pendingPenaltyLines = 0;
    this.queue = [];
    this.clearPiece();
    this.setBoard(createBoard());
  }

  givePiece(type) {
    this.queue.push(type);
    if (!this.currentPiece) this.currentPiece = new Piece(this.queue.shift());
  }

  clearPiece() {
    this.currentPiece = null;
  }

  setBoard(newBoard) {
    this.board = newBoard;
    this.spectrum = computeSpectrum(newBoard);
  }

  setPiece(piece) {
    this.currentPiece = piece;
  }

  addPenaltyLines(count) {
    this.pendingPenaltyLines += count;
  }

  consumePenaltyLines() {
    const lines = this.pendingPenaltyLines;
    this.pendingPenaltyLines = 0;
    return lines;
  }

  kill() {
    this.alive = false;
  }

  isAlive() {
    return this.alive;
  }

  toPublicData() {
    return {
      id: this.id,
      name: this.name,
      alive: this.alive,
      board: this.board,
      currentPiece: this.currentPiece?.toData(),
      spectrum: this.spectrum,
    };
  }
}
