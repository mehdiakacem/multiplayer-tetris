export default function rotate(piece) {
  const newPiece = piece.clone();
  const direction = 1;

  newPiece.rotation = (piece.rotation + direction + 4) % 4;
  const N = piece.matrix.length;
  newPiece.matrix = Array.from({ length: N }, () => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      newPiece.matrix[x][N - 1 - y] = piece.matrix[y][x];
    }
  }
  return newPiece;
}
