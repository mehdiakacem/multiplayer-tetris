import { GAME_STATUS } from "../../constants/gameStatus";
import "./Opponents.css";

function Opponents({ opponents, hostId, status }) {
  const sortedOpponents = [...opponents].sort((a, b) => {
    if (a.alive === b.alive) return 0;
    return a.alive ? -1 : 1;
  });
  // const spectrum = [2, 9, 14, 6, 18, 11, 4, 20, 7, 1];

  const emptySpectrum = [];
  return (
    <div className="opponents">
      {sortedOpponents.map((player) => (
        <div key={player.id} className="opponent">
          <span
            className={`opponent-name ${!player.alive && status !== GAME_STATUS.WAITING && "eliminated"}`}
          >
            {player.id === hostId ? player.name + " (Host)" : player.name}
          </span>
          <Spectrum
            spectrum={player.spectrum || emptySpectrum}
            isAlive={player.alive}
          />
        </div>
      ))}
    </div>
  );
}

export default Opponents;

function Spectrum({ spectrum, isAlive }) {
  return (
    <div className="spectrum">
      {spectrum.map((h, i) => (
        <div key={i} className="spectrum-col">
          <div
            className={`spectrum-fill ${!isAlive && "eliminated"}`}
            style={{ height: `${h * 5}%` }}
          />
        </div>
      ))}
    </div>
  );
}
