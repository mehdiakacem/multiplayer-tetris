import Opponents from "../Opponents/Opponents";
import "./OpponentsPanel.css";

function OpponentsPanel({ opponents, hostId, status }) {
  return (
    <aside className="opponents-panel">
      {opponents.length > 0 && (
        <>
          <h3>Opponents</h3>
          <Opponents opponents={opponents} hostId={hostId} status={status} />
        </>
      )}
    </aside>
  );
}

export default OpponentsPanel;
