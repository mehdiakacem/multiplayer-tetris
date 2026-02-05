import React from "react";
import "./NextPiece.css";
import { TETROMINOS } from "../../logic/tetrominos";

const NextPiece = ({ type }) => {
  if (!type) {
    return (
      <div className="next-piece-container">
        <h3>Next Piece</h3>
        <div className="next-piece-grid"></div>
      </div>
    );
  }
  const PIECE_COLORS = {
    I: "cyan",
    O: "yellow",
    T: "purple",
    S: "green",
    Z: "red",
    J: "blue",
    L: "orange",
    0: "",
  };
  const pieceMatrix = TETROMINOS[type];
  return (
    <div className="next-piece-container">
      <h3>Next Piece</h3>
      <div className="next-piece-grid">
        {pieceMatrix.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`next-piece-cell ${cell ? PIECE_COLORS[type] : ""}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;
