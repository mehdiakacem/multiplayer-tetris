import BoardSection from "../../components/BoardSection/BoardSection.jsx";
import Opponents from "../../components/Opponents/Opponents.jsx";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import "./GamePage.css";
import { useGameSocket } from "../../hooks/useGameSocket.js";
import { useKeyboardInput } from "../../hooks/useKeyboardInput.js";

function GamePage() {
  let { room, playerName } = useParams();
  const navigate = useNavigate();

  const { socket, game, opponents, hostId, status } =
    useGameSocket({
      room,
      playerName,
    });

  const isHost = socket.id === hostId;

  useKeyboardInput({
    onInput: (action) => socket.emit("player-input", { action }),
    onEscape: () => navigate("/"),
  });

  const handleStartClick = () => socket.emit("start-game");

  const player = game?.players.find((p) => p.id === socket.id);

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
      <Opponents opponents={opponents} hostId={hostId} />
      {/* <NextPiece type={nextPieceType} /> */}
    </>
  );
}

export default GamePage;
