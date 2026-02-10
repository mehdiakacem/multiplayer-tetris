import BoardPanel from "../BoardPanel/BoardPanel";
import OpponentsPanel from "../OpponentsPanel/OpponentsPanel";
import "./Game.css";

function Game({ opponents }) {
  return (
    <main className="game-layout">
      <OpponentsPanel opponents={opponents} />
      <BoardPanel />
      <aside className="panel">
        <h3>Next Piece</h3>

        <div className="nextPiece">
          <div className="cell filled"></div>
          <div className="cell filled"></div>
          <div className="cell filled"></div>
          <div className="cell filled"></div>
        </div>

        <hr />

        <p>
          <strong>Controls</strong>
          <br />
          ← → Move
          <br />
          ↑ Rotate
          <br />
          ↓ Soft drop
          <br />
          Space Hard drop
        </p>
      </aside>
    </main>
  );
}

export default Game;
