import BoardSection from "../../components/BoardSection/BoardSection.jsx";
import Opponents from "../../components/Opponents/Opponents.jsx";
import { useParams, useNavigate } from "react-router";
import "./GamePage.css";
import { useGameSocket } from "../../hooks/useGameSocket.js";
import { useKeyboardInput } from "../../hooks/useKeyboardInput.js";
import { useCallback } from "react";

function GamePage() {
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
  const safeOpponents = opponents ?? [];

  return (
    <>
      <span>
        {playerName} {isHost && "(Host)"}
      </span>

      <BoardSection
        player={player}
        status={status}
        isHost={isHost}
        onRestart={handleStartClick}
      />

      <Opponents opponents={safeOpponents} hostId={hostId} />
    </>
  );
}

export default GamePage;
