import Board from "../Board/Board";
import "./BoardPanel.css";
import Overlay from "../Overlay/Overlay";

function BoardPanel({ player, status, isHost, onStart,  game }) {
  return (
    <section className="board-panel">
      <Board board={player?.board} activePiece={player?.currentPiece} />
      <Overlay
        status={status}
        isHost={isHost}
        onStart={onStart}
        game={game}
      />
    </section>
  );
}

export default BoardPanel;
