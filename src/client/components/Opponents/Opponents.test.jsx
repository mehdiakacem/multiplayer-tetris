import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Opponents from "./Opponents";

describe("Opponents", () => {
  it("renders list of opponents", () => {
    const mockOpponents = [
      { id: 1, name: "Player 1", spectrum: [5, 10, 8] },
      { id: 2, name: "Player 2", spectrum: [3, 7, 12] },
    ];

    render(<Opponents opponents={mockOpponents} hostId={1} />);

    expect(screen.getByText("Player 1 (Host)")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  it("shows (Host) label only for the host", () => {
    const mockOpponents = [
      { id: 1, name: "Alice", spectrum: [] },
      { id: 2, name: "Bob", spectrum: [] },
      { id: 3, name: "Charlie", spectrum: [] },
    ];

    render(<Opponents opponents={mockOpponents} hostId={2} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob (Host)")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders spectrum for each opponent", () => {
    const mockOpponents = [
      { id: 1, name: "Player 1", spectrum: [5, 10, 8] },
      { id: 2, name: "Player 2", spectrum: [3, 7] },
    ];

    const { container } = render(
      <Opponents opponents={mockOpponents} hostId={1} />,
    );

    const spectrums = container.querySelectorAll(".spectrum");
    expect(spectrums.length).toBe(2);
  });

  it("renders correct number of spectrum columns", () => {
    const mockOpponents = [
      { id: 1, name: "Player 1", spectrum: [5, 10, 8, 6, 12] },
    ];

    const { container } = render(
      <Opponents opponents={mockOpponents} hostId={1} />,
    );

    const columns = container.querySelectorAll(".spectrum-col");
    expect(columns.length).toBe(5);
  });

  it("applies correct height to spectrum bars", () => {
    const mockOpponents = [{ id: 1, name: "Player 1", spectrum: [10, 5] }];

    const { container } = render(
      <Opponents opponents={mockOpponents} hostId={1} />,
    );

    const fills = container.querySelectorAll(".spectrum-fill");
    expect(fills[0]).toHaveStyle({ height: "50%" }); // 10 * 5% = 50%
    expect(fills[1]).toHaveStyle({ height: "25%" }); // 5 * 5% = 25%
  });

  it("handles opponent without spectrum data", () => {
    const mockOpponents = [
      { id: 1, name: "Player 1" }, // no spectrum property
    ];

    const { container } = render(
      <Opponents opponents={mockOpponents} hostId={1} />,
    );

    const spectrum = container.querySelector(".spectrum");
    expect(spectrum).toBeInTheDocument();
    // emptySpectrum means no columns
    const columns = container.querySelectorAll(".spectrum-col");
    expect(columns.length).toBe(0);
  });

  it("renders empty list when no opponents", () => {
    const { container } = render(<Opponents opponents={[]} hostId={1} />);

    const opponents = container.querySelector(".opponents");
    expect(opponents.children.length).toBe(0);
  });

  it("has opponents container with correct class", () => {
    const mockOpponents = [{ id: 1, name: "Player 1", spectrum: [] }];

    const { container } = render(
      <Opponents opponents={mockOpponents} hostId={1} />,
    );

    expect(container.querySelector(".opponents")).toBeInTheDocument();
  });
});
