import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../socket";
import { createGameSocketMiddleware } from "../middleware/gameSocketMiddleware";
import { GAME_STATUS } from "../constants/gameStatus";
import {
  applyPredictedAction,
  playerPredictionChanged,
  reconcilePredictedPlayer,
} from "../game/prediction";
import { GAME_TICK_INTERVAL_MS } from "../../shared/gameTiming";

export function useGameSocket({ room, playerName }) {
  const [opponents, setOpponents] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState(null);
  const pendingActionsRef = useRef([]);
  const optimisticPlayerRef = useRef(null);
  const nextActionIdRef = useRef(0);
  const lastAcknowledgedActionIdRef = useRef(0);
  const playerRef = useRef(null);
  const serverTickRef = useRef(0);
  const gravityPredictedTickRef = useRef(0);

  // Create middleware instance (memoized)
  const middleware = useMemo(() => createGameSocketMiddleware(socket), []);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const syncPlayerFromGameState = useCallback(
    (nextGame) => {
      const myId = middleware.getId();
      const authoritativePlayer = nextGame?.players?.find((p) => p.id === myId) ?? null;
      serverTickRef.current = nextGame?.tick ?? serverTickRef.current;

      if (gravityPredictedTickRef.current <= serverTickRef.current) {
        gravityPredictedTickRef.current = 0;
      }

      if (!authoritativePlayer) {
        pendingActionsRef.current = [];
        optimisticPlayerRef.current = null;
        setPlayer(null);
        return null;
      }

      pendingActionsRef.current = pendingActionsRef.current.filter(
        (pendingAction) => pendingAction.id > lastAcknowledgedActionIdRef.current,
      );

      const reconciledPlayer = reconcilePredictedPlayer(
        authoritativePlayer,
        pendingActionsRef.current,
      );

      const displayedPlayer = gravityPredictedTickRef.current > serverTickRef.current
        ? applyPredictedAction(reconciledPlayer.player, "down")
        : reconciledPlayer.player;

      pendingActionsRef.current = reconciledPlayer.pendingActions;
      optimisticPlayerRef.current =
        reconciledPlayer.pendingActions.length > 0 ||
        gravityPredictedTickRef.current > serverTickRef.current
          ? displayedPlayer
        : null;
      setPlayer(displayedPlayer);

      return authoritativePlayer;
    },
    [middleware],
  );

  const sendPlayerInput = useCallback(
    (action) => {
      const basePlayer = optimisticPlayerRef.current ?? player;
      const nextPlayer = applyPredictedAction(basePlayer, action);

      if (playerPredictionChanged(basePlayer, nextPlayer)) {
        const actionId = nextActionIdRef.current + 1;
        nextActionIdRef.current = actionId;
        pendingActionsRef.current = [
          ...pendingActionsRef.current,
          { id: actionId, action },
        ];
        optimisticPlayerRef.current = nextPlayer;
        setPlayer(nextPlayer);
        middleware.sendPlayerInput(action, actionId);
        return;
      }

      middleware.sendPlayerInput(action);
    },
    [middleware, player],
  );

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) {
      gravityPredictedTickRef.current = 0;
      return;
    }

    const intervalId = window.setInterval(() => {
      if (gravityPredictedTickRef.current > serverTickRef.current) {
        return;
      }

      const basePlayer = optimisticPlayerRef.current ?? playerRef.current;
      const nextPlayer = applyPredictedAction(basePlayer, "down");

      if (!playerPredictionChanged(basePlayer, nextPlayer)) {
        return;
      }

      gravityPredictedTickRef.current = serverTickRef.current + 1;
      optimisticPlayerRef.current = nextPlayer;
      setPlayer(nextPlayer);
    }, GAME_TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (!room || !playerName) {
      return;
    }

    const isCurrentRoomEvent = (eventRoom, gameRoom) => {
      const resolvedRoom = eventRoom ?? gameRoom;
      return resolvedRoom === room;
    };

    const joinCurrentRoom = () => {
      middleware.joinRoom(room, playerName);
    };

    middleware.on("connect", joinCurrentRoom);

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

    middleware.on("input-ack", ({ actionId }) => {
      if (typeof actionId !== "number") return;
      lastAcknowledgedActionIdRef.current = Math.max(
        lastAcknowledgedActionIdRef.current,
        actionId,
      );
      pendingActionsRef.current = pendingActionsRef.current.filter(
        (pendingAction) => pendingAction.id > lastAcknowledgedActionIdRef.current,
      );
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
      nextActionIdRef.current = 0;
      lastAcknowledgedActionIdRef.current = 0;
      serverTickRef.current = game.tick ?? 0;
      gravityPredictedTickRef.current = 0;
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

    if (middleware.isConnected()) {
      joinCurrentRoom();
    } else {
      middleware.connect();
    }

    return () => {
      pendingActionsRef.current = [];
      optimisticPlayerRef.current = null;
      nextActionIdRef.current = 0;
      lastAcknowledgedActionIdRef.current = 0;
      serverTickRef.current = 0;
      gravityPredictedTickRef.current = 0;
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
