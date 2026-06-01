"""Shared linear programming parsing and 2D geometry."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import numpy as np


@dataclass
class LPConstraint:
    coeffs: list[float]
    rhs: float
    op: Literal["<=", ">=", "="]


@dataclass
class LPProblem:
    sense: Literal["max", "min"]
    objective: list[float]
    constraints: list[LPConstraint]
    bounds: list[tuple[float | None, float | None]] | None = None


def parse_lp_payload(data: dict) -> LPProblem:
    constraints = [
        LPConstraint(
            coeffs=[float(c) for c in row["coeffs"]],
            rhs=float(row["rhs"]),
            op=row.get("op", row.get("sense", "<=")),
        )
        for row in data["constraints"]
    ]
    bounds = None
    if data.get("bounds"):
        bounds = []
        for b in data["bounds"]:
            lo = None if b[0] is None else float(b[0])
            hi = None if b[1] is None else float(b[1])
            bounds.append((lo, hi))
    return LPProblem(
        sense=data.get("sense", "max"),
        objective=[float(c) for c in data["objective"]],
        constraints=constraints,
        bounds=bounds,
    )


def line_intersection(
    a1: float, b1: float, c1: float, a2: float, b2: float, c2: float
) -> tuple[float, float] | None:
    det = a1 * b2 - a2 * b1
    if abs(det) < 1e-12:
        return None
    x = (c1 * b2 - c2 * b1) / det
    y = (a1 * c2 - a2 * c1) / det
    return x, y


def is_feasible_2d(
    x1: float, x2: float, problem: LPProblem, tol: float = 1e-7
) -> bool:
    for con in problem.constraints:
        val = con.coeffs[0] * x1 + con.coeffs[1] * x2
        if con.op == "<=" and val > con.rhs + tol:
            return False
        if con.op == ">=" and val < con.rhs - tol:
            return False
        if con.op == "=" and abs(val - con.rhs) > tol:
            return False
    if problem.bounds:
        if problem.bounds[0][0] is not None and x1 < problem.bounds[0][0] - tol:
            return False
        if problem.bounds[0][1] is not None and x1 > problem.bounds[0][1] + tol:
            return False
        if problem.bounds[1][0] is not None and x2 < problem.bounds[1][0] - tol:
            return False
        if problem.bounds[1][1] is not None and x2 > problem.bounds[1][1] + tol:
            return False
    return True


def objective_value(problem: LPProblem, x1: float, x2: float) -> float:
    return problem.objective[0] * x1 + problem.objective[1] * x2


def solve_lp_2d_vertices(problem: LPProblem) -> dict:
    """Graphical / vertex enumeration for 2-variable LP."""
    lines: list[tuple[float, float, float, str]] = []
    for i, con in enumerate(problem.constraints):
        a, b = con.coeffs[0], con.coeffs[1]
        lines.append((a, b, con.rhs, f"c{i+1}: {a}x₁+{b}x₂={con.rhs}"))

    # bounding box from constraints
    xs, ys = [0.0], [0.0]
    for con in problem.constraints:
        a, b, c = con.coeffs[0], con.coeffs[1], con.rhs
        if abs(b) > 1e-12:
            ys.append(c / b)
        if abs(a) > 1e-12:
            xs.append(c / a)
    x_max = max(xs) * 1.2 + 1
    y_max = max(ys) * 1.2 + 1

    border = [
        (1, 0, 0, "x₁=0"),
        (0, 1, 0, "x₂=0"),
        (1, 0, x_max, f"x₁={x_max:.2g}"),
        (0, 1, y_max, f"x₂={y_max:.2g}"),
    ]
    all_lines = lines + border

    candidates: list[tuple[float, float]] = []
    for i in range(len(all_lines)):
        for j in range(i + 1, len(all_lines)):
            a1, b1, c1, _ = all_lines[i]
            a2, b2, c2, _ = all_lines[j]
            pt = line_intersection(a1, b1, c1, a2, b2, c2)
            if pt and is_feasible_2d(pt[0], pt[1], problem):
                candidates.append(pt)

    if not candidates:
        raise ValueError("No feasible region found — check constraints.")

    best = max(candidates, key=lambda p: objective_value(problem, p[0], p[1]))
    if problem.sense == "min":
        best = min(candidates, key=lambda p: objective_value(problem, p[0], p[1]))

    obj_opt = objective_value(problem, best[0], best[1])
    active = []
    for con in problem.constraints:
        val = con.coeffs[0] * best[0] + con.coeffs[1] * best[1]
        if abs(val - con.rhs) < 1e-5:
            active.append(
                {
                    "constraint": f"{con.coeffs[0]}x₁+{con.coeffs[1]}x₂ {con.op} {con.rhs}",
                    "slack": 0.0,
                }
            )

    return {
        "x": [best[0], best[1]],
        "objectiveValue": obj_opt,
        "vertices": [{"x1": p[0], "x2": p[1], "z": objective_value(problem, p[0], p[1])} for p in candidates],
        "activeConstraints": active,
        "bounds": {"xMax": x_max, "yMax": y_max},
    }
