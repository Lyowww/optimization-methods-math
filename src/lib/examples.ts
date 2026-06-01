import type { MethodId } from "./methods";

export const EXAMPLES: Record<MethodId, unknown> = {
  newton: {
    function: "x**3 - 2*x - 5",
    derivative: "3*x**2 - 2",
    x0: 2,
    tolerance: 1e-6,
    max_iterations: 50,
    numerical_derivative: false,
  },
  jacobi: {
    A: [
      [10, 1, 1],
      [2, 10, 1],
      [2, 2, 10],
    ],
    b: [12, 13, 14],
    x0: [0, 0, 0],
    tolerance: 1e-6,
    max_iterations: 100,
  },
  "gauss-seidel": {
    A: [
      [10, 1, 1],
      [2, 10, 1],
      [2, 2, 10],
    ],
    b: [12, 13, 14],
    x0: [0, 0, 0],
    tolerance: 1e-6,
    max_iterations: 100,
    compare: true,
  },
  lagrange: {
    points: [
      { x: 1, y: 2 },
      { x: 2, y: 5 },
      { x: 4, y: 7 },
      { x: 5, y: 11 },
    ],
    show_basis: false,
  },
  "least-squares": {
    points: [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 6 },
    ],
  },
  lu: {
    A: [
      [2, 1, 1],
      [4, -6, 0],
      [-2, 7, 2],
    ],
    b: [5, -2, 9],
  },
};
