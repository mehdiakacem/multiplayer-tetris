import move from "./move.js";

export default function hardDrop(board, piece, isValidPosition) {
  let droppedPiece = piece;

  while (true) {
    const nextPiece = move(droppedPiece, 0, 1);

    if (!isValidPosition(board, nextPiece)) {
      return droppedPiece;
    }

    droppedPiece = nextPiece;
  }
}
