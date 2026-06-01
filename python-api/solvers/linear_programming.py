"""Linear programming solver using SciPy simplex (highs) with educational steps."""
from __future__ import annotations

from typing import Any

import numpy as np
from scipy.optimize import linprog

from .lp_common import LPProblem, parse_lp_payload, solve_lp_2d_vertices
from .utils import academic_style, fig_to_base64


def _to_scipy(problem: LPProblem):
    n = len(problem.objective)
    c = np.array(problem.objective, dtype=float)
    if problem.sense == "max":
        c = -c

    A_ub, b_ub = [], []
    A_eq, b_eq = [], []
    for con in problem.constraints:
        row = np.array(con.coeffs + [0.0] * (n - len(con.coeffs)))[:n]
        if con.op == "<=":
            A_ub.append(row)
            b_ub.append(con.rhs)
        elif con.op == ">=":
            A_ub.append(-row)
            b_ub.append(-con.rhs)
        else:
            A_eq.append(row)
            b_eq.append(con.rhs)

    bounds = problem.bounds or [(0, None)] * n
    return c, np.array(A_ub) if A_ub else None, np.array(b_ub) if b_ub else None, np.array(A_eq) if A_eq else None, np.array(b_eq) if b_eq else None, bounds


def solve_linear_programming(payload: dict) -> dict[str, Any]:
    problem = parse_lp_payload(payload)
    n = len(problem.objective)

    steps = [
        {"step": 1, "title": "Problem formulation", "detail": f"{'Maximize' if problem.sense == 'max' else 'Minimize'} z = {' + '.join(f'{c}x_{i+1}' for i, c in enumerate(problem.objective))}"},
        {"step": 2, "title": "Constraints", "detail": "; ".join(f"{c.coeffs} {c.op} {c.rhs}" for c in problem.constraints)},
        {"step": 3, "title": "Simplex / interior point", "detail": "Solving standard-form LP with SciPy HiGHS dual simplex"},
    ]

    c, A_ub, b_ub, A_eq, b_eq, bounds = _to_scipy(problem)
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method="highs")

    if not res.success:
        raise ValueError(res.message)

    x = res.x.tolist()
    obj = float(np.dot(problem.objective, res.x))
    if problem.sense == "min":
        obj = float(res.fun) if problem.sense == "min" else obj

    active = []
    for con in problem.constraints:
        val = sum(ci * xi for ci, xi in zip(con.coeffs, x))
        slack = con.rhs - val if con.op == "<=" else val - con.rhs
        if abs(slack) < 1e-5:
            active.append({"constraint": str(con.coeffs), "binding": True})

    steps.append({"step": 4, "title": "Optimum", "detail": f"x* = {x}, z* = {obj:.6g}"})
    steps.append({"step": 5, "title": "Active constraints", "detail": str(active) or "none detected"})

    plot_data: dict[str, Any] = {}
    img = None
    if n == 2:
        geom = solve_lp_2d_vertices(problem)
        plot_data = _plot_lp_2d(problem, geom)
        academic_style()
        import matplotlib.pyplot as plt

        fig, ax = plt.subplots(figsize=(9, 6))
        x_max, y_max = geom["bounds"]["xMax"], geom["bounds"]["yMax"]
        x1 = np.linspace(-0.2, x_max, 200)
        for con in problem.constraints:
            a, b, rhs = con.coeffs[0], con.coeffs[1], con.rhs
            if abs(b) > 1e-12:
                ax.plot(x1, (rhs - a * x1) / b, linewidth=1.5, label=f"{a}x₁+{b}x₂={rhs}")
        verts = geom["vertices"]
        if verts:
            vx = [v["x1"] for v in verts] + [verts[0]["x1"]]
            vy = [v["x2"] for v in verts] + [verts[0]["x2"]]
            ax.fill(vx, vy, alpha=0.15, color="#22d3ee")
        ax.scatter(geom["x"][0], geom["x"][1], c="#fbbf24", s=100, zorder=5)
        ax.set_xlim(0, x_max)
        ax.set_ylim(0, y_max)
        ax.set_xlabel("x₁")
        ax.set_ylabel("x₂")
        ax.set_title("Linear Programming — feasible region")
        ax.legend(fontsize=7, loc="best")
        ax.grid(True, alpha=0.35)
        img = fig_to_base64(fig)

    return {
        "method": "linear-programming",
        "input": payload,
        "iterations": steps,
        "result": {
            "x": x,
            "objectiveValue": obj,
            "activeConstraints": active,
            "simplexMessage": res.message,
        },
        "error": None,
        "converged": True,
        "formulas": {
            "standard": "A x \\le b,\\; x \\ge 0",
            "optimality": "\\nabla z = \\sum \\lambda_i \\nabla g_i \\text{ (active constraints)}",
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }


def _plot_lp_2d(problem: LPProblem, geom: dict) -> dict:
    c1, c2 = problem.objective
    x_opt, y_opt = geom["x"]
    z_opt = geom["objectiveValue"]
    x_max, y_max = geom["bounds"]["xMax"], geom["bounds"]["yMax"]

    frames = []
    for t in np.linspace(0, 1, 24):
        k = z_opt * t
        if abs(c2) > 1e-12:
            x_line = np.linspace(0, x_max, 2)
            y_line = (k - c1 * x_line) / c2
            frames.append({"x": x_line.tolist(), "y": y_line.tolist(), "level": float(k)})

    constraint_lines = []
    for i, con in enumerate(problem.constraints):
        a, b, rhs = con.coeffs[0], con.coeffs[1], con.rhs
        x_line = np.linspace(0, x_max, 50)
        if abs(b) > 1e-12:
            constraint_lines.append(
                {
                    "x": x_line.tolist(),
                    "y": ((rhs - a * x_line) / b).tolist(),
                    "name": f"{a}x₁+{b}x₂ {con.op} {rhs}",
                }
            )

    return {
        "constraintLines": constraint_lines,
        "vertices": geom["vertices"],
        "optimum": {"x1": x_opt, "x2": y_opt, "z": z_opt},
        "objectiveFrames": frames,
        "bounds": geom["bounds"],
    }
