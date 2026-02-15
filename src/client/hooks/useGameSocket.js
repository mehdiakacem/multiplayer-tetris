import { useEffect, useState, useMemo } from "react";
import { socket } from "../socket";
import { createGameSocketMiddleware } from "../middleware/gameSocketMiddleware";
import { GAME_STATUS } from "../constants/gameStatus";

export function useGameSocket({ room, playerName }) {
  const [opponents, setOpponents] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState(null);

  // Create middleware instance (memoized)
  const middleware = useMemo(
    () => createGameSocketMiddleware(socket),
    []
  );

  useEffect(() => {
    if (!room || !playerName) {
      return;
    }

    middleware.connect();

    middleware.on("connect", () => {
      middleware.joinRoom(room, playerName);
    });

    middleware.on("player-joined", ({ players, hostId }) => {
      setOpponents(players.filter((p) => p.id !== middleware.getId()));
      setHostId(hostId);
      setStatus(GAME_STATUS.WAITING);
    });

    middleware.on("join-denied", ({ reason }) => {
      if (reason === "Game already started") {
        setStatus(GAME_STATUS.STARTED);
      } else {
        setStatus(GAME_STATUS.DENIED);
      }
    });

    middleware.on("player-left", ({ id, hostId }) => {
      setOpponents((prev) => prev.filter((p) => p.id !== id));
      setHostId(hostId);
    });

    middleware.on("game-started", ({ game }) => {
      setGame(game);
      setStatus(GAME_STATUS.PLAYING);
    });

    middleware.on("game-state", ({ game }) => {
      setGame(game);
      const me = game.players.find((p) => p.id === middleware.getId());
      if (!me) return;
      setStatus(me.alive ? GAME_STATUS.PLAYING : GAME_STATUS.ELIMINATED);
      if (game.ended) {
        setStatus(me.id === game.winner?.id ? GAME_STATUS.WON : GAME_STATUS.ENDED);
      }
      setOpponents(game.players.filter((p) => p.id !== middleware.getId()));
      setHostId(game.hostId);
    });

    return () => {
      middleware.cleanup();
      setOpponents([]);
      setHostId(null);
      setGame(null);
      setStatus(null);
    };
  }, [room, playerName, middleware]);

  return {
    middleware,
    game,
    opponents,
    hostId,
    status,
  };
}