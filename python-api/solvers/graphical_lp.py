"""Graphical linear programming visualizer (2 variables)."""
from __future__ import annotations

from typing import Any

import numpy as np

from .lp_common import parse_lp_payload, solve_lp_2d_vertices
from .utils import academic_style, fig_to_base64


def solve_graphical_lp(payload: dict) -> dict[str, Any]:
    problem = parse_lp_payload(payload)
    if len(problem.objective) != 2:
        raise ValueError("Graphical LP requires exactly 2 decision variables (x₁, x₂).")

    geom = solve_lp_2d_vertices(problem)
    c1, c2 = problem.objective
    x_opt, y_opt = geom["x"][0], geom["x"][1]
    z_opt = geom["objectiveValue"]
    x_max, y_max = geom["bounds"]["xMax"], geom["bounds"]["yMax"]

    steps = [
        {"step": 1, "title": "Draw constraints", "detail": f"{len(problem.constraints)} linear constraints in the (x₁,x₂) plane"},
        {"step": 2, "title": "Feasible polygon", "detail": f"{len(geom['vertices'])} corner vertices enumerated"},
        {"step": 3, "title": "Objective sweep", "detail": f"Level curves c₁x₁+c₂x₂=k moved toward {'max' if problem.sense == 'max' else 'min'}"},
        {"step": 4, "title": "Optimal vertex", "detail": f"x* = ({x_opt:.4g}, {y_opt:.4g}), z* = {z_opt:.4g}"},
    ]

    # Feasible region mesh for shading
    x1g = np.linspace(0, x_max, 80)
    x2g = np.linspace(0, y_max, 80)
    X1, X2 = np.meshgrid(x1g, x2g)
    from .lp_common import is_feasible_2d

    feas = np.vectorize(lambda a, b: is_feasible_2d(a, b, problem))(X1, X2)

    constraint_lines = []
    for i, con in enumerate(problem.constraints):
        a, b, rhs = con.coeffs[0], con.coeffs[1], con.rhs
        x_line = np.linspace(0, x_max, 80)
        if abs(b) > 1e-12:
            constraint_lines.append(
                {
                    "x": x_line.tolist(),
                    "y": ((rhs - a * x_line) / b).tolist(),
                    "name": f"{a}x₁+{b}x₂ {con.op} {rhs}",
                    "id": i,
                }
            )

    frames = []
    z_levels = np.linspace(0, z_opt, 30) if problem.sense == "max" else np.linspace(z_opt, z_opt * 0.2 + 0.01, 30)
    for k in z_levels:
        if abs(c2) > 1e-12:
            x_line = np.linspace(0, x_max, 2)
            y_line = (k - c1 * x_line) / c2
            frames.append({"x": x_line.tolist(), "y": y_line.tolist(), "level": float(k)})

    plot_data = {
        "constraintLines": constraint_lines,
        "feasibleMesh": {
            "x": X1[feas].tolist() if np.any(feas) else [],
            "y": X2[feas].tolist() if np.any(feas) else [],
        },
        "vertices": geom["vertices"],
        "optimum": {"x1": x_opt, "x2": y_opt, "z": z_opt},
        "objectiveFrames": frames,
        "bounds": {"xMax": x_max, "yMax": y_max},
        "sense": problem.sense,
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 6))
    ax.contourf(X1, X2, feas.astype(float), levels=[0.5, 1.5], colors=["#22d3ee"], alpha=0.2)
    for cl in constraint_lines:
        ax.plot(cl["x"], cl["y"], linewidth=1.8, label=cl["name"])
    if frames:
        ax.plot(frames[-1]["x"], frames[-1]["y"], "y--", linewidth=2, label="Objective at optimum")
    ax.scatter(x_opt, y_opt, c="#fbbf24", s=120, zorder=6, edgecolors="white")
    ax.set_xlim(0, x_max)
    ax.set_ylim(0, y_max)
    ax.set_xlabel("x₁")
    ax.set_ylabel("x₂")
    ax.set_title("Graphical Linear Programming")
    ax.legend(fontsize=7, loc="upper right")
    ax.grid(True, alpha=0.35)
    img = fig_to_base64(fig)

    return {
        "method": "graphical-lp",
        "input": payload,
        "iterations": steps,
        "result": {
            "x": [x_opt, y_opt],
            "objectiveValue": z_opt,
            "activeConstraints": geom["activeConstraints"],
            "vertices": geom["vertices"],
        },
        "error": None,
        "converged": True,
        "formulas": {
            "objective": f"z = {c1}x_1 + {c2}x_2 \\to {problem.sense}",
            "vertexTheorem": "\\text{Optimum occurs at a vertex of the feasible polygon}",
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
