import { useNavigate } from "react-router";
import { useState } from "react";
import "./JoinGameForm.css";

export default function JoinGameForm() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [room, setRoom] = useState("");

  const isDisabled =
    playerName.trim() === "" || room.trim() === "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDisabled) return;

    navigate(`/${room}/${playerName}`);
  };

  return (
    <form onSubmit={handleSubmit} className="join-form">
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button
        type="submit"
        disabled={isDisabled}
        className={`join-button ${isDisabled ? "disabled" : ""}`}
      >
        JOIN
      </button>
    </form>
  );
}
