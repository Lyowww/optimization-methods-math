import type { LPPayload } from "./api";

export const EXAMPLES = {
  "constrained-extremum": {
    objective: "x1**2 + x2**2",
    equalities: ["x1 + x2 - 1"],
    inequalities: ["-x1", "-x2"],
  },
  "linear-programming": {
    sense: "max",
    objective: [3, 2],
    constraints: [
      { coeffs: [1, 0], rhs: 4, op: "<=" as const },
      { coeffs: [0, 1], rhs: 6, op: "<=" as const },
      { coeffs: [1, 1], rhs: 8, op: "<=" as const },
    ],
  } satisfies LPPayload,
  "graphical-lp": {
    sense: "max",
    objective: [3, 2],
    constraints: [
      { coeffs: [1, 0], rhs: 4, op: "<=" as const },
      { coeffs: [0, 1], rhs: 6, op: "<=" as const },
      { coeffs: [1, 1], rhs: 8, op: "<=" as const },
    ],
  } satisfies LPPayload,
  "calculus-of-variations": {
    integrand: "yp**2",
    a: 0,
    b: 1,
    y_a: 0,
    y_b: 1,
  },
};
