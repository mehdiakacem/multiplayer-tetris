import { Link } from "react-router";
import { GAME_STATUS } from "../../constants/gameStatus";
import JoinGameForm from "../JoinGameForm/JoinGameForm";
import "./Overlay.css";

function Overlay({ status, isHost, onStart, game }) {
  if (status === null) {
    return (
      <div className="overlay">
        <JoinGameForm />
      </div>
    );
  }

  const screens = {
    [GAME_STATUS.WAITING]: () => (
      <OverlayShell>
        {isHost ? (
          <span>Press START to begin the game</span>
        ) : (
          <>
            <p>Waiting for host to start</p>
            <LeaveRoomButton onClick={onStart} variant="secondaryButton" />
          </>
        )}
      </OverlayShell>
    ),

    [GAME_STATUS.ELIMINATED]: () => (
      <OverlayShell>
        <p>ELIMINATED</p>
      </OverlayShell>
    ),

    [GAME_STATUS.ENDED]: () => (
      <OverlayShell>
        <p>GAME OVER</p>
        {game?.winner && <p>Winner: {game.winner.name}</p>}
        <RestartOrWait isHost={isHost} onStart={onStart} />
      </OverlayShell>
    ),

    [GAME_STATUS.WON]: () => (
      <OverlayShell>
        <p className="result">YOU WIN</p>
        <RestartOrWait isHost={isHost} onStart={onStart} />
      </OverlayShell>
    ),

    [GAME_STATUS.STARTED]: () => (
      <div className="overlay">
        <p>Game already started</p>
      </div>
    ),
  };

  return (screens[status] ?? (() => null))();
}

function OverlayShell({ children }) {
  return (
    <div className="overlay">
      <div className="gameOverPanel">{children}</div>
    </div>
  );
}

function RestartOrWait({ isHost, onStart }) {
  return isHost ? (
    <>
      <p>Press RESTART to start a new game</p>
      <button className="primaryButton" onClick={onStart}>
        RESTART
      </button>
    </>
  ) : (
    <>
      <p>Waiting for host to restart...</p>
      <LeaveRoomButton onClick={onStart} variant="primaryButton" />
    </>
  );
}

function LeaveRoomButton({ onClick, variant }) {
  return (
    <Link to="/">
      <button className={variant} onClick={onClick}>
        Leave Room
      </button>
    </Link>
  );
}

export default Overlay;
