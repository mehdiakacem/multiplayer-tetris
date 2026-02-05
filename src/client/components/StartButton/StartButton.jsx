import "./StartButton.css";

function StartButton({ onClick, restart }) {
  return (
    <div className="start-button-container">
      <button className="start-button" onClick={onClick}>
        {restart ? "RESTART" : "START"}
      </button>
    </div>
  );
}

export default StartButton;
