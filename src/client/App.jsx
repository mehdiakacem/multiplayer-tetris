import "./App.css";
import Header from "./components/Header/Header";

export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="game-layout">
        <aside className="panel">
          <h3>Opponents</h3>
          <div className="opponent">
            <div>Alice</div>
            <div className="spectrum">▮▮▮▮▮▯▯▯▯▯</div>
          </div>
          <div className="opponent">
            <div>Bob</div>
            <div className="spectrum">▮▮▮▮▮▮▮▯▯▯</div>
          </div>
        </aside>

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
    </div>
  );
}
