export default function lockPiece(board, piece) {
  const {
    matrix,
    position: { x: offsetX, y: offsetY },
    type,
  } = piece;

  const newBoard = board.map(row => [...row]);

  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;

      newBoard[offsetY + y][offsetX + x] = type;
    });
  });

  return newBoard;
}
