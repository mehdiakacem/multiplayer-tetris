import { useState } from "react";
import BoardPanel from "../BoardPanel/BoardPanel";
import InfoPanel from "../InfoPanel/InfoPanel";
import OpponentsPanel from "../OpponentsPanel/OpponentsPanel";
import "./Game.css";

function Game({ opponents, player, onStart, status, isHost, hostId, game }) {
  const [activeTab, setActiveTab] = useState("board");

  return (
    <main className="game-layout">
      <OpponentsPanel opponents={opponents} hostId={hostId} status={status} />
      <BoardPanel
        player={player}
        status={status}
        isHost={isHost}
        onStart={onStart}
        game={game}
      />
      <InfoPanel />

      <div className="mobile-drawer">
        <div className="drawer-tabs">
          <button
            className={`tab ${activeTab === "opponents" ? "active" : ""}`}
            onClick={() => setActiveTab("opponents")}
          >
            Opponents
          </button>
          <button
            className={`tab ${activeTab === "board" ? "active" : ""}`}
            onClick={() => setActiveTab("board")}
          >
            Board
          </button>
          <button
            className={`tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
        </div>
        <div className="drawer-content">
          {activeTab === "opponents" && (
            <OpponentsPanel
              opponents={opponents}
              hostId={hostId}
              status={status}
            />
          )}
          {activeTab === "info" && <InfoPanel />}
          {activeTab === "board" && (
            <BoardPanel
              player={player}
              status={status}
              isHost={isHost}
              onStart={onStart}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default Game;
