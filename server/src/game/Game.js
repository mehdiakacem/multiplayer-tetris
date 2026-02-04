import Piece from "./Piece.js";
import { addGarbageLines } from "./logic/addGarbageLines.js";
import clearLines from "./logic/clearLines.js";
import createBoard from "./logic/createBoard.js";
import hardDrop from "./logic/hardDrop.js";
import isValidPosition from "./logic/isValidPosition.js";
import lockPiece from "./logic/lockPiece.js";
import move from "./logic/move.js";
import rotate from "./logic/rotate.js";

const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

export default class Game {
  constructor(room) {
    this.room = room;

    this.players = new Map();
    this.hostId = null;

    this.started = false;
    this.ended = false;

    this.bag = [];
    this.bagIndex = 0;
  }

  computeMove(piece, action) {
    switch (action) {
      case "left":
        return move(piece, -1, 0);
      case "right":
        return move(piece, 1, 0);
      case "rotate":
        return rotate(piece);
      case "down":
        return move(piece, 0, 1);
      default:
        return null;
    }
  }

  handleHardDrop(player, io) {
    const droppedPiece = hardDrop(
      player.board,
      player.currentPiece,
      isValidPosition,
    );

    const boardWithLockedPiece = lockPiece(player.board, droppedPiece);

    const { linesCleared, newBoard } = clearLines(boardWithLockedPiece);

    this.handleLineClear(player.id, linesCleared);

    const penalties = player.consumePenaltyLines();
    const finalBoard = addGarbageLines(newBoard, penalties);

    player.setBoard(finalBoard);
    player.clearPiece();

    const newPiece = this.spawnPieceForAll();

    if (!isValidPosition(player.board, newPiece)) {
      this.killPlayer(player.id, io);
      return -1;
    }
  }

  handleInput(playerId, action, io) {
    const player = this.players.get(playerId);
    if (!player || !player.alive || !player.currentPiece) return;

    if (action === "hardDrop") {
      return this.handleHardDrop(player, io);
    }

    const newPiece = this.computeMove(player.currentPiece, action);
    if (!newPiece) return;

    if (isValidPosition(player.board, newPiece)) {
      player.setPiece(newPiece);
    }
  }

  lockCurrentPiece(player, io) {
    let newBoard = lockPiece(player.board, player.currentPiece);

    // clear lines
    const result = clearLines(newBoard);
    player.setBoard(result.newBoard);
    if (result.linesCleared > 0) {
      // handle line clear
      this.handleLineClear(player.id, result.linesCleared);
    }

    // apply penalties
    const penalties = player.consumePenaltyLines();
    if (penalties > 0) {
      newBoard = addGarbageLines(player.board, penalties);
      player.setBoard(newBoard);
    }

    // Spaw next pice
    player.clearPiece();
    const piece = this.spawnPieceForAll();
    if (!isValidPosition(player.board, piece)) {
      this.killPlayer(player.id, io);
      return -1;
      // player.clearPiece();
    }
  }

  tick(io) {
    if (!this.started || this.ended) return;

    this.players.forEach((player) => {
      if (!player.alive || !player.currentPiece) return;

      const test = player.currentPiece.clone();
      test.move(0, 1);

      if (isValidPosition(player.board, test)) {
        player.currentPiece.move(0, 1);
      } else {
        this.lockCurrentPiece(player, io);
      }
    });
  }

  addPlayer(player) {
    if (this.started) return;

    if (this.players.size === 0) {
      this.hostId = player.id;
    }

    this.players.set(player.id, player);
  }

  removePlayer(socketId) {
    this.players.delete(socketId);

    if (this.hostId === socketId) {
      const nextHost = this.players.values().next().value;
      this.hostId = nextHost ? nextHost.id : null;
    }
  }

  isEmpty() {
    return this.players.size === 0;
  }

  startGame(requesterId) {
    if (requesterId !== this.hostId) return false;
    if (this.started) return false;

    this.started = true;
    this.ended = false;

    this.resetPlayers();
    this.resetBag();
    this.spawnPieceForAll();

    return true;
  }

  endedGame(io) {
    this.started = false;
    this.ended = true;
    io.to(this.room).emit("game-over", { game: this.getPublicState() });
  }

  resetPlayers() {
    this.players.forEach((player) => {
      player.alive = true;
      player.setBoard(createBoard());
      player.pendingPenaltyLines = 0;
      player.queue = [];
      player.clearPiece();
    });
  }

  resetBag() {
    this.bag = shuffle([...PIECE_TYPES]);
    this.bagIndex = 0;
  }

  getNextPiece() {
    if (this.bagIndex >= this.bag.length) {
      this.bag = shuffle([...PIECE_TYPES]);
      this.bagIndex = 0;
    }

    return this.bag[this.bagIndex++];
  }

  spawnPieceForAll() {
    const type = this.getNextPiece();
    this.players.forEach((player) => {
      if (player.alive) {
        player.givePiece(type);
      }
    });
    return new Piece(type);
  }

  handleLineClear(clearingPlayerId, linesCleared) {
    if (linesCleared <= 0) return;

    const penalty = linesCleared - 1;

    if (penalty <= 0) return;

    this.players.forEach((player, id) => {
      if (id !== clearingPlayerId && player.alive) {
        player.addPenaltyLines(penalty);
      }
    });
  }

  killPlayer(playerId, io) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.kill();

    const alivePlayers = [...this.players.values()].filter((p) => p.alive);

    if (alivePlayers.length <= 1) {
      this.endedGame(io);
    }
  }

  getPublicState() {
    return {
      room: this.room,
      started: this.started,
      ended: this.ended,
      hostId: this.hostId,
      players: [...this.players.values()].map((p) => p.toPublicData()),
    };
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
