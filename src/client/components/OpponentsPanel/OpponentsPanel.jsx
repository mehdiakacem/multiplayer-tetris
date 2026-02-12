import Panel from "../Panel/Panel";
import Opponents from "../Opponents/Opponents";


function OpponentsPanel({ opponents, hostId }) {
  return (
    <Panel>
      {opponents.length > 0 && (
        <>
          <h3>Opponents</h3>
          <Opponents opponents={opponents} hostId={hostId} />
        </>
      )}
    </Panel>
  );
}

export default OpponentsPanel;
