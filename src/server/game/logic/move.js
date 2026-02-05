export default function move(piece, dx, dy) {
  const newPiece = piece.clone();

  newPiece.position.x += dx;
  newPiece.position.y += dy;

  return newPiece;
}
