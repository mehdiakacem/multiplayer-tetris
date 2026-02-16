import "./InfoPanel.css";

const InfoPanel = () => {
  return (
    <aside className="panel">
      {/* <h3>Next Piece</h3>

      <div className="next-piece">
        <div className="cell filled"></div>
        <div className="cell filled"></div>
        <div className="cell filled"></div>
        <div className="cell filled"></div>
      </div>

      <hr /> */}

      <p>
        <strong>Controls</strong>
        <br />
        ← → Move
        <br />
        ↑ Rotate
        <br />
        ↓ Soft drop
        <br />
        Space Hard drop
      </p>
    </aside>
  );
};

export default InfoPanel;
