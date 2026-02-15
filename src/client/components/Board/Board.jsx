import "./Board.css";

export default function Board({ board, activePiece }) {
  const PIECE_COLORS = {
    I: "cyan filled",
    O: "yellow filled",
    T: "purple filled",
    S: "green filled",
    Z: "red filled",
    J: "blue filled",
    L: "orange filled",
    0: "empty",
    X: "gray",
  };
  return (
    <div className="board">
      {board && board.map((row, y) =>
        row.map((cellType, x) => (
          <Cell
            key={`${x}-${y}`}
            color={
              isActiveCell(x, y, activePiece)
                ? PIECE_COLORS[activePiece.type]
                : PIECE_COLORS[cellType]
            }
          />
        ))
      )}
    </div>
  );
}

function Cell({ color }) {
  return <div className={`cell ${color}`} />;
}

function isActiveCell(x, y, piece) {
  if (!piece) return false;

  const localX = x - piece.position.x;
  const localY = y - piece.position.y;

  return Boolean(piece.matrix[localY]?.[localX]);
}
