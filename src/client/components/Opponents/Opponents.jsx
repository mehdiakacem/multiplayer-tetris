import "./Opponents.css";

function Opponents({ opponents, hostId }) {
  // const spectrum = [2, 9, 14, 6, 18, 11, 4, 20, 7, 1];
  const emptySpectrum = [];
  return (
    <div className="opponents">
      {opponents.map((player) => (
        <div key={player.id}>
          <span>
            {player.id === hostId ? player.name + " (Host)" : player.name}
          </span>
          <Spectrum spectrum={player.spectrum || emptySpectrum} />
        </div>
      ))}
    </div>
  );
}

export default Opponents;

function Spectrum({ spectrum }) {
  return (
    <div className="spectrum">
      {spectrum.map((h, i) => (
        <div key={i} className="spectrum-col">
          <div className="spectrum-fill" style={{ height: `${h * 5}%` }} />
        </div>
      ))}
    </div>
  );
}
