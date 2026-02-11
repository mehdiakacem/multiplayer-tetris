import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GAME_STATUS } from "../../constants/gameStatus";
import GameOverlay from "./GameOverlay";

describe("GameOverlay", () => {
  it("shows StartButton when status is WAITING and user is host", () => {
    render(
      <GameOverlay
        status={GAME_STATUS.WAITING}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("shows WaitingForHost when status is WAITING and user is not host", () => {
    render(
      <GameOverlay
        status={GAME_STATUS.WAITING}
        isHost={false}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(/waiting for host/i)).toBeInTheDocument();
  });

  it('shows "You lost" message when status is ELIMINATED', () => {
    render(
      <GameOverlay
        status={GAME_STATUS.ELIMINATED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText("You lost")).toBeInTheDocument();
    expect(screen.getByText("Waiting for game to end...")).toBeInTheDocument();
  });

  it('shows "You lost" with StartButton when status is ENDED and user is host', () => {
    render(
      <GameOverlay
        status={GAME_STATUS.ENDED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText("You lost")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restart/i }),
    ).toBeInTheDocument();
  });

  it('shows "You lost" with WaitingForHost when status is ENDED and user is not host', () => {
    render(
      <GameOverlay
        status={GAME_STATUS.ENDED}
        isHost={false}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText("You lost")).toBeInTheDocument();
  });

  it('shows "You won" message when status is WON', () => {
    render(
      <GameOverlay
        status={GAME_STATUS.WON}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(/you won/i)).toBeInTheDocument();
  });

  it('shows "Game already started" message when status is STARTED', () => {
    render(
      <GameOverlay
        status={GAME_STATUS.STARTED}
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText("Game already started")).toBeInTheDocument();
  });

  it("calls onRestart when host clicks restart button", () => {
    const mockOnRestart = vi.fn();
    render(
      <GameOverlay
        status={GAME_STATUS.ENDED}
        isHost={true}
        onRestart={mockOnRestart}
      />,
    );

    const button = screen.getByRole("button", { name: /restart/i });
    button.click();

    expect(mockOnRestart).toHaveBeenCalled();
  });

  it("returns null when status is unknown", () => {
    const { container } = render(
      <GameOverlay
        status="UNKNOWN_STATUS"
        isHost={true}
        onRestart={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
