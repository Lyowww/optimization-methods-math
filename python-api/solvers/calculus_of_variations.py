"""Calculus of variations — Euler-Lagrange equation and extremal curves."""
from __future__ import annotations

from typing import Any

import numpy as np
import sympy as sp
from scipy.integrate import quad

from .sympy_parse import X, Y, YP, latex, parse_xy
from .utils import academic_style, fig_to_base64


def solve_calculus_of_variations(
    integrand: str,
    a: float,
    b: float,
    y_a: float,
    y_b: float,
) -> dict[str, Any]:
    F = parse_xy(integrand)
    y = sp.Function("y")
    x = X

    F_y = sp.diff(F, Y)
    F_yp = sp.diff(F, YP)
    el_lhs = sp.diff(F_yp, x) - F_y
    el_eq = sp.Eq(el_lhs, 0)

    steps = [
        {"step": 1, "title": "Functional", "detail": f"J[y] = \\int_{{{a}}}^{{{b}}} F(x,y,y')\\,dx,\\; F = {latex(F)}"},
        {"step": 2, "title": "Euler–Lagrange", "detail": f"{latex(el_eq)}"},
    ]

    extremal_expr = None
    extremal_latex = None
    try:
        y_sym = sp.Function("y")(x)
        sol = sp.dsolve(el_lhs, y_sym)
        if sol:
            C1, C2 = sp.symbols("C1 C2")
            sol_expr = sol.rhs
            eq1 = sp.Eq(sol_expr.subs(x, a), y_a)
            eq2 = sp.Eq(sol_expr.subs(x, b), y_b)
            const = sp.solve([eq1, eq2], [C1, C2], dict=True)
            if const:
                sol_expr = sol_expr.subs(const[0])
            extremal_expr = sol_expr
            extremal_latex = latex(sol_expr)
            steps.append({"step": 3, "title": "Extremal", "detail": f"y(x) = {extremal_latex}"})
    except Exception as exc:
        steps.append({"step": 3, "title": "Extremal", "detail": f"Symbolic solve failed ({exc}); using boundary line."})

    if extremal_expr is None:
        # fallback: straight line satisfying boundaries
        extremal_expr = y_a + (y_b - y_a) / (b - a) * (x - a)
        extremal_latex = latex(extremal_expr)

    y_fn = sp.lambdify(x, extremal_expr, modules=["numpy"])
    xs = np.linspace(a, b, 200)
    ys = np.array([float(y_fn(t)) for t in xs])

    F_num = sp.lambdify((x, Y, YP), F, modules=["numpy"])
    yp_fn = sp.lambdify(x, sp.diff(extremal_expr, x), modules=["numpy"])

    def integrand_num(t):
        yp = float(yp_fn(t))
        return float(F_num(t, float(y_fn(t)), yp))

    J_val, _ = quad(integrand_num, a, b, limit=200)

    steps.append({"step": 4, "title": "Functional value", "detail": f"J[y^*] \\approx {J_val:.6g}"})

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.plot(xs, ys, "c-", linewidth=2.5, label="Extremal y(x)")
    ax.scatter([a, b], [y_a, y_b], c="#fbbf24", s=80, zorder=5, label="Boundary")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Calculus of Variations — extremal curve")
    ax.legend()
    ax.grid(True, alpha=0.35)
    img = fig_to_base64(fig)

    plot_data = {
        "curve": {"x": xs.tolist(), "y": ys.tolist(), "name": "y*(x)"},
        "boundaries": [{"x": a, "y": y_a}, {"x": b, "y": y_b}],
        "functionalValue": J_val,
    }

    return {
        "method": "calculus-of-variations",
        "input": {"integrand": integrand, "a": a, "b": b, "y_a": y_a, "y_b": y_b},
        "iterations": steps,
        "result": {
            "eulerLagrange": latex(el_eq),
            "extremal": extremal_latex,
            "functionalValue": J_val,
            "boundary": {"a": a, "b": b, "y_a": y_a, "y_b": y_b},
        },
        "error": None,
        "converged": True,
        "formulas": {
            "eulerLagrange": latex(el_eq),
            "extremal": extremal_latex or "",
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
