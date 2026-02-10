import OpponentsPanel from "../OpponentsPanel/OpponentsPanel";
import Panel from "../Panel/Panel";
import "./Game.css";

function Game({ opponents }) {
  return (
    <main className="game-layout">
      <OpponentsPanel opponents={opponents} />

      {/* <!-- CENTER: BOARD --> */}
      <section className="boardPanel">
        <div className="board">
          {/* <!-- 20 × 10 = 200 cells --> */}
          {/* <!-- Example row --> */}
          <div className="cell"></div>
          <div className="cell filled"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          <div className="cell"></div>
          {/* <!-- repeat until you reach 200 cells --> */}
        </div>
      </section>

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
