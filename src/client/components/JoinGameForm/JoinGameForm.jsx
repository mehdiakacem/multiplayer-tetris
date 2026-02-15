import { useNavigate } from "react-router";
import { useState } from "react";
import "./JoinGameForm.css";

export default function JoinGameForm() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [room, setRoom] = useState("");

  const isDisabled = playerName.trim() === "" || room.trim() === "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDisabled) return;

    navigate(`/${room}/${playerName}`);
  };

  return (
    <form onSubmit={handleSubmit} className="join-form">
      <h2 className="formTitle">Join Game</h2>
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="input"
        maxLength={10}
        id="playerName"
      />

      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="input"
        maxLength={10}
        id="roomName"
      />

      <button
        type="submit"
        disabled={isDisabled}
        className={`primaryButton ${isDisabled ? "disabled" : ""}`}
      >
        JOIN
      </button>
    </form>
  );
}
