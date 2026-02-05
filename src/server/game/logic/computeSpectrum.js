function computeSpectrum(board) {
  const heights = Array(10).fill(0);
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 20; row++) {
      if (board[row][col] !== 0) {
        heights[col] = 20 - row;
        break;
      }
    }
  }
  return heights;
}
export default computeSpectrum;