import "./App.css";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";
import { useGameSocket } from "./hooks/useGameSocket";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import { useParams, useNavigate } from "react-router";
import { useCallback } from "react";

export default function App() {
  const { room, playerName } = useParams();
  const navigate = useNavigate();

  const { socket, game, opponents, hostId, status } = useGameSocket({
    room,
    playerName,
  });

  const socketId = socket?.id;
  const isHost = !!socketId && socketId === hostId;

  useKeyboardInput({
    onInput: (action) => socket?.emit("player-input", { action }),
    onEscape: () => navigate("/"),
  });

  const handleStartClick = useCallback(
    () => socket?.emit("start-game"),
    [socket],
  );

  const player = game?.players?.find((p) => p.id === socketId);
  return (
    <div className="app">
      <Header roomName={room} status={status} isHost={isHost} onStart={handleStartClick} />
      <Game
        player={player}
        opponents={opponents}
        onStart={handleStartClick}
        status={status}
        isHost={isHost}
      />
    </div>
  );
}
