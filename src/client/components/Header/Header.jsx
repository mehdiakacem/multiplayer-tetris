import "./Header.css";

const Header = ({ roomName, status, isHost }) => {
  return (
    <header className="header">
      <h1>Red Tetris</h1>
      {roomName && (
        <span className="room-info">
          <strong>Room:</strong> {roomName} · <span>{status}</span>
        </span>
      )}
      {isHost && <button>Start</button>}
    </header>
  );
};

export default Header;
