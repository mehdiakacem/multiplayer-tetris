import Panel from "../Panel/Panel";

function OpponentsPanel({ opponents }) {
  return (
    <Panel>
      {opponents.length > 0 && (
        <>
          <h3>Opponents</h3>
          <div className="opponent">
            <div>Alice</div>
            <div className="spectrum">▮▮▮▮▮▯▯▯▯▯</div>
          </div>
          <div className="opponent">
            <div>Bob</div>
            <div className="spectrum">▮▮▮▮▮▮▮▯▯▯</div>
          </div>
        </>
      )}
    </Panel>
  );
}

export default OpponentsPanel;
