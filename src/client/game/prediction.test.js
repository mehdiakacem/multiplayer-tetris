import { describe, expect, it } from "vitest";
import {
  applyPredictedAction,
  applyPredictedActions,
  reconcilePredictedPlayer,
} from "./prediction";

function createBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

function createPlayer(overrides = {}) {
  return {
    id: "s1",
    alive: true,
    board: createBoard(),
    currentPiece: {
      type: "T",
      rotation: 0,
      position: { x: 4, y: 0 },
      matrix: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
    },
    ...overrides,
  };
}

describe("prediction helpers", () => {
  it("applies valid local movement", () => {
    const player = createPlayer();

    const nextPlayer = applyPredictedAction(player, "left");

    expect(nextPlayer.currentPiece.position.x).toBe(3);
    expect(nextPlayer.currentPiece.position.y).toBe(0);
  });

  it("ignores invalid optimistic movement", () => {
    const player = createPlayer({
      currentPiece: {
        type: "T",
        rotation: 0,
        position: { x: 0, y: 0 },
        matrix: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
      },
    });

    const nextPlayer = applyPredictedAction(player, "left");

    expect(nextPlayer).toBe(player);
  });

  it("predicts rotate and hard drop using shared server logic", () => {
    const player = createPlayer();

    const rotatedPlayer = applyPredictedAction(player, "rotate");
    const droppedPlayer = applyPredictedAction(player, "hardDrop");

    expect(rotatedPlayer.currentPiece.rotation).toBe(1);
    expect(rotatedPlayer.currentPiece.matrix).toEqual([
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ]);
    expect(droppedPlayer.currentPiece.position.y).toBe(18);
  });

  it("reconciles pending inputs against newer authoritative snapshots", () => {
    const authoritativePlayer = createPlayer();
    const pendingActions = ["right", "right"];
    const optimisticPlayer = applyPredictedActions(
      authoritativePlayer,
      pendingActions,
    );

    const nextAuthoritativePlayer = applyPredictedAction(
      authoritativePlayer,
      "right",
    );
    const reconciled = reconcilePredictedPlayer(
      nextAuthoritativePlayer,
      pendingActions,
      optimisticPlayer,
    );

    expect(reconciled.pendingActions).toEqual(["right"]);
    expect(reconciled.player.currentPiece.position.x).toBe(6);
  });

  it("clears optimistic state when the server snapshot diverges", () => {
    const authoritativePlayer = createPlayer();
    const optimisticPlayer = applyPredictedAction(authoritativePlayer, "right");
    const divergentPlayer = createPlayer({
      currentPiece: {
        ...authoritativePlayer.currentPiece,
        position: { x: 1, y: 5 },
      },
    });

    const reconciled = reconcilePredictedPlayer(
      divergentPlayer,
      ["right"],
      optimisticPlayer,
    );

    expect(reconciled.pendingActions).toEqual([]);
    expect(reconciled.player.currentPiece.position).toEqual({ x: 1, y: 5 });
  });
});
