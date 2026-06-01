"""Linear least squares fitting."""
from typing import Any

import numpy as np

from .utils import academic_style, fig_to_base64


def solve_least_squares(points: list[dict]) -> dict[str, Any]:
    if len(points) < 2:
        raise ValueError("At least two points are required")
    xs = np.array([p["x"] for p in points], dtype=float)
    ys = np.array([p["y"] for p in points], dtype=float)
    n = len(xs)

    # y = a + b*x
    A = np.column_stack([np.ones(n), xs])
    coeffs, _, _, _ = np.linalg.lstsq(A, ys, rcond=None)
    a, b = float(coeffs[0]), float(coeffs[1])

    y_hat = a + b * xs
    residuals = ys - y_hat
    sse = float(np.sum(residuals**2))
    mse = sse / n

    x_min, x_max = xs.min() - 0.5, xs.max() + 0.5
    x_line = np.linspace(x_min, x_max, 100)
    y_line = a + b * x_line

    residual_lines = []
    for i in range(n):
        residual_lines.append(
            {
                "x": [float(xs[i]), float(xs[i])],
                "y": [float(ys[i]), float(y_hat[i])],
            }
        )

    plot_data = {
        "points": [{"x": float(xs[i]), "y": float(ys[i])} for i in range(n)],
        "line": {"x": x_line.tolist(), "y": y_line.tolist(), "name": f"ŷ = {a:.4g} + {b:.4g}x"},
        "residuals": residual_lines,
        "fitted": [{"x": float(xs[i]), "y": float(y_hat[i])} for i in range(n)],
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.scatter(xs, ys, c="gold", s=70, label="Data", zorder=5)
    ax.plot(x_line, y_line, "c-", linewidth=2, label=f"ŷ = {a:.4g} + {b:.4g}x")
    for rl in residual_lines:
        ax.plot(rl["x"], rl["y"], "r--", alpha=0.6, linewidth=1)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title(f"Least Squares (SSE = {sse:.4g})")
    ax.legend()
    ax.grid(True, alpha=0.4)
    img = fig_to_base64(fig)

    return {
        "method": "least-squares",
        "input": {"points": points},
        "iterations": [],
        "result": {
            "a": a,
            "b": b,
            "equation": f"y = {a:.6g} + {b:.6g} x",
            "sse": sse,
            "mse": mse,
            "residuals": residuals.tolist(),
        },
        "error": mse,
        "converged": True,
        "formulas": {
            "normal": "\\mathbf{A}^T\\mathbf{A}\\mathbf{c} = \\mathbf{A}^T\\mathbf{y}",
            "line": f"y = {a:.6g} + {b:.6g}x",
            "sse": f"\\sum_i (y_i - \\hat y_i)^2 = {sse:.6g}",
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
