import { useEffect, useState } from "react";
import { socket } from "../socket";
import { GAME_STATUS } from "../constants/gameStatus";

export function useGameSocket({ room, playerName }) {
  const [opponents, setOpponents] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!room || !playerName) {
      return;
    }
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join-room", { room, playerName });
    });

    socket.on("player-joined", ({ players, hostId }) => {
      setOpponents(players.filter((p) => p.id !== socket.id));
      setHostId(hostId);
      setStatus(GAME_STATUS.WAITING);
    });

    socket.on("join-denied", () => {
      setStatus(GAME_STATUS.STARTED);
    });

    socket.on("player-left", ({ id, hostId }) => {
      setOpponents((prev) => prev.filter((p) => p.id !== id));
      setHostId(hostId);
    });

    socket.on("game-started", ({ game }) => {
      setGame(game);
      setStatus(GAME_STATUS.PLAYING);
    });

    socket.on("game-state", ({ game }) => {
      setGame(game);
      const me = game.players.find((p) => p.id === socket.id);
      if (!me) return;
      setStatus(me.alive ? GAME_STATUS.PLAYING : GAME_STATUS.ELIMINATED);
      if (game.ended) {
        setStatus(me.id === game.winner?.id ? GAME_STATUS.WON : GAME_STATUS.ENDED);
      }
      setOpponents(game.players.filter((p) => p.id !== socket.id));
    });

    return () => {
      socket.disconnect();
      setOpponents([]);
      setHostId(null);
      setGame(null);
      setStatus(null);
    };
  }, [room, playerName]);
  return {
    socket,
    game,
    opponents,
    hostId,
    status,
  };
}
