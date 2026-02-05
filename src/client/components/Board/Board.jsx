import "./Board.css";

export default function Board({ board, activePiece }) {
  if (!board) {
    return <div className="board"></div>;
  }
  const PIECE_COLORS = {
    I: "cyan",
    O: "yellow",
    T: "purple",
    S: "green",
    Z: "red",
    J: "blue",
    L: "orange",
    0: "",
    X: "gray",
  };
  return (
    <div className="board">
      {board.map((row, y) =>
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
