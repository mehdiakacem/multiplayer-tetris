import Board from "../Board/Board";
import GameOverlay from "../Overlay/Overlay";

export default function BoardSection({
  player,
  status,
  isHost,
  onRestart,
}) {
  return (
    <div className="board-container">
      <GameOverlay
        status={status}
        isHost={isHost}
        onRestart={onRestart}
      />

      <Board board={player?.board} activePiece={player?.currentPiece} />
    </div>
  );
}
