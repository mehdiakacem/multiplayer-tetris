import { Link } from "react-router";
import "./Header.css";

const Header = ({ roomName, status, isHost, onStart }) => {
  return (
    <header className="header">
      {/* LEFT: Logo */}
      <Link to="/" className="logoGroup">
        <div className="logo">
          <div className="rtLogo" aria-label="Red Tetris">
            <span className="rtLogo__text">RT</span>
          </div>
        </div>
        <span className="brandName">Red Tetris</span>
      </Link>

      {/* CENTER: Room Info */}
      {roomName && (
        <span className="room-info">
          <strong>Room:</strong> {roomName} · <span>{status}</span>
        </span>
      )}

      {/* RIGHT: Host Button */}
      {isHost && (
        <button className="primaryButton" onClick={onStart}>
          START
        </button>
      )}
    </header>
  );
};

export default Header;
