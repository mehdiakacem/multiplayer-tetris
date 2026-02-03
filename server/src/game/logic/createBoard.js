export default function createBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}