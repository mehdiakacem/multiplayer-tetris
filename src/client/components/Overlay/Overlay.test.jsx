import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router";
import { GAME_STATUS } from "../../constants/gameStatus";
import Overlay from "./Overlay";

// Mock the JoinGameForm component to keep tests simple
vi.mock("../JoinGameForm/JoinGameForm", () => ({
  default: () => <div>Join Game Form</div>,
}));

// Helper to render with router (needed for Link component)
function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe("Overlay", () => {
  // Test 1: Show join form when status is null
  it("shows join form when status is null", () => {
    renderWithRouter(
      <Overlay status={null} isHost={false} onStart={vi.fn()} game={null} />
    );

    expect(screen.getByText("Join Game Form")).toBeInTheDocument();
  });

  // Test 2: WAITING status - host sees start message
  it("shows start message when host is waiting", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.WAITING}
        isHost={true}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText(/press start to begin/i)).toBeInTheDocument();
  });

  // Test 3: WAITING status - non-host sees waiting message
  it("shows waiting message for non-host", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.WAITING}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText(/waiting for host/i)).toBeInTheDocument();
  });

  // Test 4: WAITING status - non-host sees leave button
  it("shows leave button for non-host in waiting", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.WAITING}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText(/leave room/i)).toBeInTheDocument();
  });

  it("does not call onStart when non-host clicks leave room while waiting", () => {
    const mockOnStart = vi.fn();

    renderWithRouter(
      <Overlay
        status={GAME_STATUS.WAITING}
        isHost={false}
        onStart={mockOnStart}
        game={null}
      />
    );

    fireEvent.click(screen.getByText(/leave room/i));

    expect(mockOnStart).not.toHaveBeenCalled();
  });

  // Test 5: ELIMINATED status shows eliminated message
  it("shows eliminated message when player is eliminated", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ELIMINATED}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText("ELIMINATED")).toBeInTheDocument();
  });

  // Test 6: ENDED status shows game over
  it("shows game over when game ends", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
  });

  // Test 7: ENDED status shows winner name
  it("shows winner name when game ends", () => {
    const mockGame = {
      winner: { name: "Alice" },
    };

    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={false}
        onStart={vi.fn()}
        game={mockGame}
      />
    );

    expect(screen.getByText(/winner: alice/i)).toBeInTheDocument();
  });

  // Test 8: ENDED status - host sees restart button
  it("shows restart button for host when game ends", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={true}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText("RESTART")).toBeInTheDocument();
  });

  // Test 9: ENDED status - non-host sees waiting for restart
  it("shows waiting for restart for non-host", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText(/waiting for host to restart/i)).toBeInTheDocument();
  });

  it("does not call onStart when non-host clicks leave room after game end", () => {
    const mockOnStart = vi.fn();

    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={false}
        onStart={mockOnStart}
        game={null}
      />
    );

    fireEvent.click(screen.getByText(/leave room/i));

    expect(mockOnStart).not.toHaveBeenCalled();
  });

  // Test 10: WON status shows you win message
  it("shows you win message when player wins", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.WON}
        isHost={true}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText("YOU WIN")).toBeInTheDocument();
  });

  // Test 11: STARTED status shows game already started
  it("shows game already started message", () => {
    renderWithRouter(
      <Overlay
        status={GAME_STATUS.STARTED}
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    expect(screen.getByText("Game already started")).toBeInTheDocument();
  });

  // Test 12: Clicking restart button calls onStart
  it("calls onStart when restart button is clicked", () => {
    const mockOnStart = vi.fn();

    renderWithRouter(
      <Overlay
        status={GAME_STATUS.ENDED}
        isHost={true}
        onStart={mockOnStart}
        game={null}
      />
    );

    const restartButton = screen.getByText("RESTART");
    fireEvent.click(restartButton);

    expect(mockOnStart).toHaveBeenCalled();
  });

  // Test 13: Returns nothing for unknown status
  it("returns nothing for unknown status", () => {
    const { container } = renderWithRouter(
      <Overlay
        status="UNKNOWN_STATUS"
        isHost={false}
        onStart={vi.fn()}
        game={null}
      />
    );

    // Should render empty (no overlay content)
    expect(container.querySelector(".overlay")).not.toBeInTheDocument();
  });
});
