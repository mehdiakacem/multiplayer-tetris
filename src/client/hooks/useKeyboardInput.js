import { useEffect, useRef } from "react";

export const KEY_REPEAT_INITIAL_DELAY_MS = 140;
export const KEY_REPEAT_INTERVAL_MS = 60;

export function useKeyboardInput({ onInput, onEscape }) {
  const onInputRef = useRef(onInput);
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onInputRef.current = onInput;
    onEscapeRef.current = onEscape;
  }, [onInput, onEscape]);

  useEffect(() => {
    const activeKeys = new Map();

    const keyMap = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "rotate",
      ArrowDown: "down",
      Space: "hardDrop",
    };

    const repeatableKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowDown"]);

    const clearKey = (code) => {
      const timers = activeKeys.get(code);
      if (!timers) return;

      if (timers.timeoutId) {
        window.clearTimeout(timers.timeoutId);
      }

      if (timers.intervalId) {
        window.clearInterval(timers.intervalId);
      }

      activeKeys.delete(code);
    };

    const clearAllKeys = () => {
      [...activeKeys.keys()].forEach(clearKey);
    };

    const fireInput = (code) => {
      const action = keyMap[code];
      if (action) {
        onInputRef.current(action);
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        if (!activeKeys.has(e.code)) {
          activeKeys.set(e.code, {});
          onEscapeRef.current();
        }
        return;
      }

      if (!keyMap[e.code] || activeKeys.has(e.code)) {
        return;
      }

      fireInput(e.code);

      if (!repeatableKeys.has(e.code)) {
        activeKeys.set(e.code, {});
        return;
      }

      const timeoutId = window.setTimeout(() => {
        const intervalId = window.setInterval(() => {
          fireInput(e.code);
        }, KEY_REPEAT_INTERVAL_MS);

        const activeKey = activeKeys.get(e.code);
        if (activeKey) {
          activeKey.intervalId = intervalId;
        }
      }, KEY_REPEAT_INITIAL_DELAY_MS);

      activeKeys.set(e.code, { timeoutId });
    };

    const handleKeyUp = (e) => {
      clearKey(e.code);
    };

    const handleBlur = () => {
      clearAllKeys();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      clearAllKeys();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onInput, onEscape]);
}
