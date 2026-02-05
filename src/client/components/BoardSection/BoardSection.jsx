import Board from "../Board/Board";
import GameOverLay from "../GameOverlay/GameOverlay";

export default function BoardSection({
  player,
  status,
  isHost,
  onRestart,
}) {
  return (
    <div className="board-container">
      <GameOverLay
        status={status}
        isHost={isHost}
        onRestart={onRestart}
      />

      <Board board={player?.board} activePiece={player?.currentPiece} />
    </div>
  );
}
