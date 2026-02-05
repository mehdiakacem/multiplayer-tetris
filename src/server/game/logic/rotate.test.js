import rotate from "./rotate";

test("rotates a 2x2 matrix clockwise", () => {
  const piece = createPiece([
    [1, 0],
    [1, 1],
  ]);

  const rotated = rotate(piece);

  expect(rotated.matrix).toEqual([
    [1, 1],
    [1, 0],
  ]);
});

test("does not mutate original piece", () => {
  const matrix = [
    [1, 0],
    [1, 1],
  ];
  const piece = createPiece(matrix);

  rotate(piece);

  expect(piece.matrix).toEqual([
    [1, 0],
    [1, 1],
  ]);
});

test("increments rotation modulo 4", () => {
  const piece = createPiece([[1]], 3);

  const rotated = rotate(piece);

  expect(rotated.rotation).toBe(0);
});

test("four rotations return the piece to its original shape", () => {
  const piece = createPiece([
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]);

  let rotated = piece;
  for (let i = 0; i < 4; i++) {
    rotated = rotate(rotated);
  }

  expect(rotated.matrix).toEqual(piece.matrix);
});

test("keeps matrix size NxN", () => {
  const piece = createPiece([
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]);

  const rotated = rotate(piece);

  expect(rotated.matrix.length).toBe(3);
  expect(rotated.matrix[0].length).toBe(3);
});

function createPiece(matrix, rotation = 0) {
  return {
    matrix,
    rotation,
    clone() {
      return createPiece(
        matrix.map((row) => [...row]),
        rotation,
      );
    },
  };
}
