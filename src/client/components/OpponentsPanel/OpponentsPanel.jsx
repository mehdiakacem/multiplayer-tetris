import Panel from "../Panel/Panel";
import Opponents from "../Opponents/Opponents";


function OpponentsPanel({ opponents, hostId, status }) {
  return (
    <Panel>
      {opponents.length > 0 && (
        <>
          <h3>Opponents</h3>
          <Opponents opponents={opponents} hostId={hostId} status={status} />
        </>
      )}
    </Panel>
  );
}

export default OpponentsPanel;
