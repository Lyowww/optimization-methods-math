"""Lagrange interpolation solver."""
from typing import Any

import numpy as np

from .utils import academic_style, fig_to_base64


def _lagrange_basis(x_points: np.ndarray, j: int, x: float) -> float:
    result = 1.0
    for m, xm in enumerate(x_points):
        if m != j:
            result *= (x - xm) / (x_points[j] - xm)
    return result


def solve_lagrange(points: list[dict], show_basis: bool = False) -> dict[str, Any]:
    if len(points) < 2:
        raise ValueError("At least two points are required for interpolation")
    xs = np.array([p["x"] for p in points], dtype=float)
    ys = np.array([p["y"] for p in points], dtype=float)
    if len(np.unique(xs)) != len(xs):
        raise ValueError("x values must be distinct")

    n = len(xs)
    x_min, x_max = xs.min() - 0.5, xs.max() + 0.5
    x_plot = np.linspace(x_min, x_max, 300)

    def P(xv):
        total = 0.0
        for j in range(n):
            total += ys[j] * _lagrange_basis(xs, j, xv)
        return total

    y_plot = np.array([P(x) for x in x_plot])

    basis_curves = []
    if show_basis:
        for j in range(n):
            yb = np.array([_lagrange_basis(xs, j, x) for x in x_plot])
            basis_curves.append({"x": x_plot.tolist(), "y": yb.tolist(), "name": f"L_{j}(x)"})

    # Build symbolic-style formula string
    terms = []
    for j in range(n):
        num_parts = [f"(x - {xs[m]:g})" for m in range(n) if m != j]
        den = np.prod([xs[j] - xs[m] for m in range(n) if m != j])
        terms.append(f"{ys[j]:g}·({'·'.join(num_parts)})/{den:g}")
    poly_formula = " + ".join(terms)

    plot_data = {
        "curve": {"x": x_plot.tolist(), "y": y_plot.tolist(), "name": "P(x)"},
        "points": [{"x": float(xs[i]), "y": float(ys[i])} for i in range(n)],
        "basis": basis_curves,
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.plot(x_plot, y_plot, "c-", linewidth=2, label="Lagrange P(x)")
    ax.scatter(xs, ys, c="gold", s=80, zorder=5, label="Data points")
    if show_basis:
        for bc in basis_curves:
            ax.plot(bc["x"], bc["y"], "--", alpha=0.5, linewidth=1, label=bc["name"])
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Lagrange Interpolation")
    ax.legend(loc="best", fontsize=8)
    ax.grid(True, alpha=0.4)
    img = fig_to_base64(fig)

    return {
        "method": "lagrange",
        "input": {"points": points, "show_basis": show_basis},
        "iterations": [],
        "result": {"polynomial_description": poly_formula, "degree": n - 1},
        "error": None,
        "converged": True,
        "formulas": {
            "lagrange": "P(x) = \\sum_{j=0}^{n-1} y_j L_j(x), \\quad L_j(x) = \\prod_{m\\neq j}\\frac{x-x_m}{x_j-x_m}",
            "expanded": poly_formula,
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
