import { useEffect } from "react";

export function useKeyboardInput({ onInput, onEscape }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      const map = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "rotate",
        ArrowDown: "down",
        Space: "hardDrop",
      };

      if (map[e.code]) {
        onInput(map[e.code]);
      }

      if (e.code === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInput, onEscape]);
}
