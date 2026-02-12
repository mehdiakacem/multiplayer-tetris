import BoardPanel from "../BoardPanel/BoardPanel";
import InfoPanel from "../InfoPanel/InfoPanel";
import OpponentsPanel from "../OpponentsPanel/OpponentsPanel";
import "./Game.css";

function Game({ opponents, player, onStart, status, isHost, hostId }) {
  return (
    <main className="game-layout">
      <OpponentsPanel opponents={opponents} hostId={hostId} status={status} />
      <BoardPanel
        player={player}
        status={status}
        isHost={isHost}
        onStart={onStart}
      />
      <InfoPanel />
    </main>
  );
}

export default Game;
