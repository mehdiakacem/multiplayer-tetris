import { GAME_STATUS } from "../../constants/gameStatus";
import JoinGameForm from "../JoinGameForm/JoinGameForm";
import StartButton from "../StartButton/StartButton";
import WaitingForHost from "../WaitingForHost/WaintingForHost";
import "./Overlay.css";

function Overlay({ status, isHost, onStart }) {
  switch (status) {
    case GAME_STATUS.WAITING:
      return (
        <div className="overlay">
          {isHost ? (
            <span>Press START to begin the game</span>
          ) : (
            <WaitingForHost />
          )}
        </div>
      );

    case GAME_STATUS.ELIMINATED:
      return (
        <div className="overlay">
          <div className="gameOverPanel">
            <p>You’re Out</p>
          </div>
        </div>
      );

    case GAME_STATUS.ENDED:
      return (
        <div className="overlay">
          <div className="gameOverPanel">
            <p>Game Over</p>
            <p>Winner: Alice</p>
            {isHost ? (
              <>
                <p>Press RESTART to start a new game</p>
                <button className="primaryButton" onClick={onStart}>
                  RESTART
                </button>
              </>
            ) : (
              <p>Waiting for host to restart the game...</p>
            )}
          </div>
        </div>
      );

    case GAME_STATUS.WON:
      return (
        <div className="overlay">
          <div className="gameOverPanel">
            <p className="result">You Win</p>
            {isHost ? (
              <StartButton onClick={onStart} restart />
            ) : (
              <WaitingForHost restart />
            )}
          </div>
        </div>
      );

    case GAME_STATUS.STARTED:
      return (
        <div className="overlay">
          <p>Game already started</p>
        </div>
      );

    case null:
      return (
        <div className="overlay">
          <JoinGameForm />
        </div>
      );

    default:
      return null;
  }
}

export default Overlay;
