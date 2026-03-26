import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  KEY_REPEAT_INITIAL_DELAY_MS,
  KEY_REPEAT_INTERVAL_MS,
  useKeyboardInput,
} from "./useKeyboardInput";

function TestComponent({ onInput, onEscape }) {
  useKeyboardInput({ onInput, onEscape });
  return <div>keyboard-input</div>;
}

describe("useKeyboardInput", () => {
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("repeats left, right, and down after an explicit delay", () => {
    vi.useFakeTimers();
    const onInput = vi.fn();

    render(<TestComponent onInput={onInput} onEscape={vi.fn()} />);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
    });

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenLastCalledWith("left");

    act(() => {
      vi.advanceTimersByTime(KEY_REPEAT_INITIAL_DELAY_MS);
    });

    expect(onInput).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(KEY_REPEAT_INTERVAL_MS * 2);
    });

    expect(onInput).toHaveBeenCalledTimes(3);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }));
      vi.advanceTimersByTime(KEY_REPEAT_INTERVAL_MS * 3);
    });

    expect(onInput).toHaveBeenCalledTimes(3);
  });

  it("fires rotate, hard drop, and escape only once per key press", () => {
    vi.useFakeTimers();
    const onInput = vi.fn();
    const onEscape = vi.fn();

    render(<TestComponent onInput={onInput} onEscape={onEscape} />);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }));
    });

    expect(onInput.mock.calls).toEqual([["rotate"], ["hardDrop"]]);
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("clears repeating keys on blur", () => {
    vi.useFakeTimers();
    const onInput = vi.fn();

    render(<TestComponent onInput={onInput} onEscape={vi.fn()} />);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowDown" }));
      vi.advanceTimersByTime(
        KEY_REPEAT_INITIAL_DELAY_MS + KEY_REPEAT_INTERVAL_MS,
      );
    });

    expect(onInput.mock.calls.length).toBeGreaterThan(1);
    const callCountAfterRepeat = onInput.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event("blur"));
      vi.advanceTimersByTime(KEY_REPEAT_INTERVAL_MS * 3);
    });

    expect(onInput).toHaveBeenCalledTimes(callCountAfterRepeat);
  });
});
