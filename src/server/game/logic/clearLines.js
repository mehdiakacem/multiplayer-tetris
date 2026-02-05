export default function clearLines(board) {
  const width = board[0].length;
  const clearedRowIndexes = [];
  const remainingRows = [];
  for (let r = 0; r < board.length; r++) {
    const isFull = board[r].every((cell) => cell !== 0);
    if (isFull && board[r][0] !== "X") clearedRowIndexes.push(r);
    else remainingRows.push(board[r]);
  }
  const newRows = Array.from({ length: clearedRowIndexes.length }, () =>
    Array(width).fill(0),
  );
  const newBoard = [...newRows, ...remainingRows];
  return {
    newBoard,
    linesCleared: clearedRowIndexes.length,
  };
}
