import BoardPanel from "../BoardPanel/BoardPanel";
import InfoPanel from "../InfoPanel/InfoPanel";
import OpponentsPanel from "../OpponentsPanel/OpponentsPanel";
import "./Game.css";

function Game({ opponents }) {
  return (
    <main className="game-layout">
      <OpponentsPanel opponents={opponents} />
      <BoardPanel />
      <InfoPanel />
    </main>
  );
}

export default Game;
