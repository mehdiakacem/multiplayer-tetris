import hardDrop from "../../server/game/logic/hardDrop.js";
import isValidPosition from "../../server/game/logic/isValidPosition.js";
import move from "../../server/game/logic/move.js";
import rotate from "../../server/game/logic/rotate.js";

export function applyPredictedAction(player, action) {
  if (!player || !player.alive || !player.currentPiece) {
    return player;
  }

  const piece = createClonablePiece(player.currentPiece);

  if (action === "hardDrop") {
    const droppedPiece = hardDrop(player.board, piece, isValidPosition);
    return {
      ...player,
      currentPiece: toPieceData(droppedPiece),
    };
  }

  const nextPiece = computeMove(piece, action);
  if (!nextPiece || !isValidPosition(player.board, nextPiece)) {
    return player;
  }

  return {
    ...player,
    currentPiece: toPieceData(nextPiece),
  };
}

export function applyPredictedActions(player, actions) {
  return actions.reduce(
    (currentPlayer, action) => applyPredictedAction(currentPlayer, action),
    player,
  );
}

export function reconcilePredictedPlayer(
  authoritativePlayer,
  pendingActions,
  optimisticPlayer,
) {
  if (!authoritativePlayer) {
    return {
      player: null,
      pendingActions: [],
    };
  }

  if (!optimisticPlayer || pendingActions.length === 0) {
    return {
      player: authoritativePlayer,
      pendingActions: [],
    };
  }

  for (let dropCount = 0; dropCount <= pendingActions.length; dropCount += 1) {
    const remainingActions = pendingActions.slice(dropCount);
    const candidatePlayer = applyPredictedActions(
      authoritativePlayer,
      remainingActions,
    );

    if (piecesEqual(candidatePlayer?.currentPiece, optimisticPlayer.currentPiece)) {
      return {
        player: remainingActions.length > 0 ? candidatePlayer : authoritativePlayer,
        pendingActions: remainingActions,
      };
    }
  }

  return {
    player: authoritativePlayer,
    pendingActions: [],
  };
}

export function playerPredictionChanged(previousPlayer, nextPlayer) {
  return !piecesEqual(previousPlayer?.currentPiece, nextPlayer?.currentPiece);
}

function computeMove(piece, action) {
  switch (action) {
    case "left":
      return move(piece, -1, 0);
    case "right":
      return move(piece, 1, 0);
    case "rotate":
      return rotate(piece);
    case "down":
      return move(piece, 0, 1);
    default:
      return null;
  }
}

function createClonablePiece(piece) {
  return {
    type: piece.type,
    rotation: piece.rotation,
    position: { ...piece.position },
    matrix: piece.matrix.map((row) => [...row]),
    clone() {
      return createClonablePiece(this);
    },
  };
}

function toPieceData(piece) {
  if (!piece) {
    return null;
  }

  return {
    type: piece.type,
    rotation: piece.rotation,
    position: { ...piece.position },
    matrix: piece.matrix.map((row) => [...row]),
  };
}

function piecesEqual(left, right) {
  if (left === right) return true;
  if (!left || !right) return left === right;
  if (left.type !== right.type || left.rotation !== right.rotation) return false;
  if (
    left.position?.x !== right.position?.x ||
    left.position?.y !== right.position?.y
  ) {
    return false;
  }

  if (left.matrix.length !== right.matrix.length) return false;

  for (let y = 0; y < left.matrix.length; y += 1) {
    if (left.matrix[y].length !== right.matrix[y]?.length) return false;

    for (let x = 0; x < left.matrix[y].length; x += 1) {
      if (left.matrix[y][x] !== right.matrix[y][x]) {
        return false;
      }
    }
  }

  return true;
}
