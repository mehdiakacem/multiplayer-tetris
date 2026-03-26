import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../socket";
import { createGameSocketMiddleware } from "../middleware/gameSocketMiddleware";
import { GAME_STATUS } from "../constants/gameStatus";
import {
  applyPredictedAction,
  playerPredictionChanged,
  reconcilePredictedPlayer,
} from "../game/prediction";

export function useGameSocket({ room, playerName }) {
  const [opponents, setOpponents] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState(null);
  const pendingActionsRef = useRef([]);
  const optimisticPlayerRef = useRef(null);

  // Create middleware instance (memoized)
  const middleware = useMemo(() => createGameSocketMiddleware(socket), []);

  const syncPlayerFromGameState = useCallback(
    (nextGame) => {
      const myId = middleware.getId();
      const authoritativePlayer = nextGame?.players?.find((p) => p.id === myId) ?? null;

      if (!authoritativePlayer) {
        pendingActionsRef.current = [];
        optimisticPlayerRef.current = null;
        setPlayer(null);
        return null;
      }

      const reconciledPlayer = reconcilePredictedPlayer(
        authoritativePlayer,
        pendingActionsRef.current,
        optimisticPlayerRef.current,
      );

      pendingActionsRef.current = reconciledPlayer.pendingActions;
      optimisticPlayerRef.current = reconciledPlayer.pendingActions.length > 0
        ? reconciledPlayer.player
        : null;
      setPlayer(reconciledPlayer.player);

      return authoritativePlayer;
    },
    [middleware],
  );

  const sendPlayerInput = useCallback(
    (action) => {
      const basePlayer = optimisticPlayerRef.current ?? player;
      const nextPlayer = applyPredictedAction(basePlayer, action);

      if (playerPredictionChanged(basePlayer, nextPlayer)) {
        pendingActionsRef.current = [...pendingActionsRef.current, action];
        optimisticPlayerRef.current = nextPlayer;
        setPlayer(nextPlayer);
      }

      middleware.sendPlayerInput(action);
    },
    [middleware, player],
  );

  useEffect(() => {
    if (!room || !playerName) {
      return;
    }

    const isCurrentRoomEvent = (eventRoom, gameRoom) => {
      const resolvedRoom = eventRoom ?? gameRoom;
      return resolvedRoom === room;
    };

    middleware.connect();

    middleware.on("connect", () => {
      middleware.joinRoom(room, playerName);
    });

    middleware.on("player-joined", ({ room: eventRoom, players, hostId }) => {
      if (!isCurrentRoomEvent(eventRoom)) return;
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

    middleware.on("player-left", ({ room: eventRoom, id, hostId }) => {
      if (!isCurrentRoomEvent(eventRoom)) return;
      setOpponents((prev) => prev.filter((p) => p.id !== id));
      setHostId(hostId);
    });

    middleware.on("game-started", ({ room: eventRoom, game }) => {
      if (!isCurrentRoomEvent(eventRoom, game?.room)) return;
      pendingActionsRef.current = [];
      optimisticPlayerRef.current = null;
      setGame(game);
      syncPlayerFromGameState(game);
      setStatus(GAME_STATUS.PLAYING);
    });

    middleware.on("game-state", ({ room: eventRoom, game }) => {
      if (!isCurrentRoomEvent(eventRoom, game?.room)) return;
      setGame(game);
      const me = syncPlayerFromGameState(game);
      if (!me) return;
      setStatus(me.alive ? GAME_STATUS.PLAYING : GAME_STATUS.ELIMINATED);
      if (game.ended) {
        setStatus(me.id === game.winner?.id ? GAME_STATUS.WON : GAME_STATUS.ENDED);
      }
      setOpponents(game.players.filter((p) => p.id !== middleware.getId()));
      setHostId(game.hostId);
    });

    return () => {
      pendingActionsRef.current = [];
      optimisticPlayerRef.current = null;
      middleware.cleanup();
      setOpponents([]);
      setHostId(null);
      setGame(null);
      setPlayer(null);
      setStatus(null);
    };
  }, [room, playerName, middleware, syncPlayerFromGameState]);

  return {
    middleware,
    game,
    player,
    opponents,
    hostId,
    sendPlayerInput,
    status,
  };
}
