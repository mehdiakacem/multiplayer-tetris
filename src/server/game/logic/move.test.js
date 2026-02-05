import move from "./move.js";

describe("move", () => {
  const createPiece = (x = 0, y = 0, type = "T") => ({
    type,
    rotation: 0,
    matrix: [[1]],
    position: { x, y },
    clone() {
      return createPiece(this.position.x, this.position.y, type);
    },
  });

  describe("Horizontal movement", () => {
    test("moves piece right by 1", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 1, 0);

      expect(moved.position.x).toBe(6);
      expect(moved.position.y).toBe(10);
    });

    test("moves piece left by 1", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, -1, 0);

      expect(moved.position.x).toBe(4);
      expect(moved.position.y).toBe(10);
    });

    test("moves piece right by multiple units", () => {
      const piece = createPiece(0, 0);

      const moved = move(piece, 3, 0);

      expect(moved.position.x).toBe(3);
      expect(moved.position.y).toBe(0);
    });

    test("moves piece left by multiple units", () => {
      const piece = createPiece(5, 0);

      const moved = move(piece, -3, 0);

      expect(moved.position.x).toBe(2);
      expect(moved.position.y).toBe(0);
    });
  });

  describe("Vertical movement", () => {
    test("moves piece down by 1", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 0, 1);

      expect(moved.position.x).toBe(5);
      expect(moved.position.y).toBe(11);
    });

    test("moves piece up by 1", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 0, -1);

      expect(moved.position.x).toBe(5);
      expect(moved.position.y).toBe(9);
    });

    test("moves piece down by multiple units", () => {
      const piece = createPiece(0, 0);

      const moved = move(piece, 0, 5);

      expect(moved.position.x).toBe(0);
      expect(moved.position.y).toBe(5);
    });
  });

  describe("Diagonal movement", () => {
    test("moves piece diagonally (right and down)", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 2, 3);

      expect(moved.position.x).toBe(7);
      expect(moved.position.y).toBe(13);
    });

    test("moves piece diagonally (left and up)", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, -2, -3);

      expect(moved.position.x).toBe(3);
      expect(moved.position.y).toBe(7);
    });
  });

  describe("No movement", () => {
    test("returns piece at same position when dx=0 and dy=0", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 0, 0);

      expect(moved.position.x).toBe(5);
      expect(moved.position.y).toBe(10);
    });
  });

  describe("Immutability", () => {
    test("does not mutate original piece", () => {
      const piece = createPiece(5, 10);
      const originalX = piece.position.x;
      const originalY = piece.position.y;

      move(piece, 3, 3);

      expect(piece.position.x).toBe(originalX);
      expect(piece.position.y).toBe(originalY);
    });

    test("returns a new piece instance", () => {
      const piece = createPiece(5, 10);

      const moved = move(piece, 1, 1);

      expect(moved).not.toBe(piece);
    });
  });

  describe("Edge cases", () => {
    test("handles negative positions", () => {
      const piece = createPiece(-5, -10);

      const moved = move(piece, 2, 3);

      expect(moved.position.x).toBe(-3);
      expect(moved.position.y).toBe(-7);
    });

    test("handles large movements", () => {
      const piece = createPiece(0, 0);

      const moved = move(piece, 100, 200);

      expect(moved.position.x).toBe(100);
      expect(moved.position.y).toBe(200);
    });
  });
});