import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StartButton from "./StartButton";

describe("StartButton", () => {
  it("renders START when restart is false", () => {
    render(<StartButton onClick={vi.fn()} restart={false} />);

    expect(screen.getByText("START")).toBeInTheDocument();
  });

  it("renders RESTART when restart is true", () => {
    render(<StartButton onClick={vi.fn()} restart={true} />);

    expect(screen.getByText("RESTART")).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    const onClickMock = vi.fn();

    render(<StartButton onClick={onClickMock} restart={false} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
