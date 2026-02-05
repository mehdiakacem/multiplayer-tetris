import { GAME_STATUS } from "../../constants/gameStatus";
import StartButton from "../StartButton/StartButton";
import WaitingForHost from "../WaitingForHost/WaintingForHost";
import "./GameOverlay.css";

function GameOverlay({ status, isHost, onRestart }) {
  switch (status) {
    case GAME_STATUS.WAITING:
      return (
        <div className="game-overlay">
          {isHost ? <StartButton onClick={onRestart} /> : <WaitingForHost />}
        </div>
      );

    case GAME_STATUS.ELIMINATED:
      return (
        <div className="game-overlay">
          <p>You lost</p>
          <p>Waiting for game to end...</p>
        </div>
      );

    case GAME_STATUS.ENDED:
      return (
        <div className="game-overlay">
          <p>You lost</p>
          {isHost ? (
            <StartButton onClick={onRestart} restart />
          ) : (
            <WaitingForHost restart />
          )}
        </div>
      );

    case GAME_STATUS.WON:
      return (
        <div className="game-overlay">
          <p>You won 🎉</p>
          {isHost ? (
            <StartButton onClick={onRestart} restart />
          ) : (
            <WaitingForHost restart />
          )}
        </div>
      );

    case GAME_STATUS.STARTED:
      return (
        <div className="game-overlay">
          <p>Game already started</p>
        </div>
      );

    default:
      return null;
  }
}

export default GameOverlay;
