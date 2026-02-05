export default function isValidPosition(board, piece) {
  for (let y = 0; y < piece.matrix.length; y++) {
    for (let x = 0; x < piece.matrix[y].length; x++) {
      if (piece.matrix[y][x] === 0) continue;

      const newX = x + piece.position.x;
      const newY = y + piece.position.y;

      // Out of bounds check
      if (newX < 0 || newX >= 10) return false;
      if (newY >= 20) return false;

      // Above the screen is allowed
      if (newY < 0) continue;

      // Collides with something
      if (board[newY][newX] !== 0) return false;
    }
  }
  return true;
}
