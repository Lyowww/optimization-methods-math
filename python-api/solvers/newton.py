"""Newton-Raphson method solver."""
from typing import Any, Callable, Optional

import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

from .utils import academic_style, fig_to_base64

_transformations = standard_transformations + (implicit_multiplication_application,)


def _parse_function(expr_str: str) -> Callable[[float], float]:
    x = sp.Symbol("x")
    expr = parse_expr(expr_str.replace("^", "**"), transformations=_transformations)
    f = sp.lambdify(x, expr, modules=["numpy"])
    return lambda xv: float(np.asarray(f(xv), dtype=float).item())


def _parse_derivative(expr_str: str, deriv_str: Optional[str]) -> Callable[[float], float]:
    x = sp.Symbol("x")
    expr = parse_expr(expr_str.replace("^", "**"), transformations=_transformations)
    if deriv_str and deriv_str.strip():
        dexpr = parse_expr(deriv_str.replace("^", "**"), transformations=_transformations)
    else:
        dexpr = sp.diff(expr, x)
    df = sp.lambdify(x, dexpr, modules=["numpy"])
    formula = str(dexpr)
    return lambda xv: float(np.asarray(df(xv), dtype=float).item()), formula


def solve_newton(
    function: str,
    derivative: Optional[str],
    x0: float,
    tolerance: float = 1e-6,
    max_iterations: int = 50,
    numerical_derivative: bool = False,
) -> dict[str, Any]:
    f = _parse_function(function)
    if numerical_derivative:
        h = 1e-8

        def df(xv: float) -> float:
            return (f(xv + h) - f(xv - h)) / (2 * h)

        deriv_formula = "f'(x) \\approx \\frac{f(x+h)-f(x-h)}{2h}"
    else:
        df, deriv_formula = _parse_derivative(function, derivative)

    iterations = []
    xk = float(x0)
    converged = False

    for k in range(max_iterations):
        fx = f(xk)
        dfx = df(xk)
        if abs(dfx) < 1e-14:
            raise ValueError("Derivative is zero — Newton method cannot continue.")
        x_next = xk - fx / dfx
        error = abs(x_next - xk)
        iterations.append(
            {
                "k": k,
                "x_k": xk,
                "f_x_k": fx,
                "f_prime_x_k": dfx,
                "x_next": x_next,
                "error": error,
            }
        )
        if error < tolerance and abs(f(x_next)) < tolerance:
            converged = True
            xk = x_next
            break
        xk = x_next

    # Plot range
    xs = [it["x_k"] for it in iterations] + [xk]
    x_min, x_max = min(xs) - 1.5, max(xs) + 1.5
    x_plot = np.linspace(x_min, x_max, 400)
    y_plot = np.array([f(x) for x in x_plot])

    tangents = []
    for it in iterations:
        x0t, y0t = it["x_k"], it["f_x_k"]
        slope = it["f_prime_x_k"]
        x_line = np.linspace(x0t - 0.8, x0t + 0.8, 2)
        y_line = y0t + slope * (x_line - x0t)
        tangents.append(
            {
                "x": x_line.tolist(),
                "y": y_line.tolist(),
                "iteration": it["k"],
            }
        )

    plot_data = {
        "curve": {"x": x_plot.tolist(), "y": y_plot.tolist(), "name": f"f(x) = {function}"},
        "tangents": tangents,
        "points": [{"x": it["x_k"], "y": it["f_x_k"], "label": f"x_{it['k']}"} for it in iterations],
        "root": {"x": xk, "y": f(xk)},
        "animationPath": [{"x": it["x_k"], "y": 0} for it in iterations]
        + [{"x": xk, "y": 0}],
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.plot(x_plot, y_plot, "c-", linewidth=2, label=f"f(x)")
    colors = plt.cm.plasma(np.linspace(0.2, 0.9, len(tangents)))
    for i, (t, c) in enumerate(zip(tangents, colors)):
        ax.plot(t["x"], t["y"], "--", color=c, alpha=0.7, linewidth=1.2, label=f"Tangent {i}")
    ax.scatter([it["x_k"] for it in iterations], [it["f_x_k"] for it in iterations], c="gold", s=60, zorder=5)
    ax.axhline(0, color="#64748b", linewidth=0.8)
    ax.axvline(xk, color="#22d3ee", linestyle=":", alpha=0.8, label=f"Root ≈ {xk:.6g}")
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    ax.set_title("Newton-Raphson Method")
    ax.legend(loc="best", fontsize=8)
    ax.grid(True, alpha=0.4)
    img = fig_to_base64(fig)

    return {
        "method": "newton",
        "input": {
            "function": function,
            "derivative": derivative or deriv_formula,
            "x0": x0,
            "tolerance": tolerance,
            "max_iterations": max_iterations,
        },
        "iterations": iterations,
        "result": {"root": xk, "f_at_root": f(xk)},
        "error": iterations[-1]["error"] if iterations else None,
        "converged": converged,
        "formulas": {
            "update": "x_{k+1} = x_k - \\frac{f(x_k)}{f'(x_k)}",
            "derivative": deriv_formula,
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
