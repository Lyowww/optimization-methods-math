"""Constrained function extremum solver (2D) with Lagrange / KKT and Hessian analysis."""
from __future__ import annotations

from typing import Any

import numpy as np
import sympy as sp
from scipy.optimize import minimize

from .sympy_parse import X1, X2, lambdify_2d, latex, parse_2d
from .utils import academic_style, fig_to_base64


def _feasible_mask(
    x1: np.ndarray,
    x2: np.ndarray,
    eq_fns: list,
    ineq_fns: list,
    eq_tol: float = 0.08,
    ineq_tol: float = 1e-6,
) -> np.ndarray:
    ok = np.ones_like(x1, dtype=bool)
    for f in eq_fns:
        ok &= np.abs(f(x1, x2)) <= eq_tol
    for h in ineq_fns:
        ok &= h(x1, x2) <= ineq_tol
    return ok


def solve_constrained_extremum(
    objective: str,
    equalities: list[str] | None = None,
    inequalities: list[str] | None = None,
) -> dict[str, Any]:
    equalities = equalities or []
    inequalities = inequalities or []

    f_expr = parse_2d(objective)
    g_exprs = [parse_2d(g) for g in equalities]
    h_exprs = [parse_2d(h) for h in inequalities]

    f_fn = lambdify_2d(f_expr)
    g_fns = [lambdify_2d(g) for g in g_exprs]
    h_fns = [lambdify_2d(h) for h in h_exprs]

    steps: list[dict[str, Any]] = []
    steps.append({"step": 1, "title": "Objective", "detail": f"f(x_1,x_2) = {latex(f_expr)}"})

    # Lagrangian (equalities)
    lam_syms: tuple = ()
    if len(g_exprs) == 1:
        lam_syms = (sp.Symbol("l0", real=True),)
    elif len(g_exprs) > 1:
        lam_syms = sp.symbols(",".join(f"l{i}" for i in range(len(g_exprs))), real=True)

    L = f_expr
    for lam, g in zip(lam_syms, g_exprs):
        L = L + lam * g

    mu_syms: tuple = ()
    if len(h_exprs) == 1:
        mu_syms = (sp.Symbol("mu0", real=True),)
    elif len(h_exprs) > 1:
        mu_syms = sp.symbols(",".join(f"mu{i}" for i in range(len(h_exprs))), real=True)
    for mu, h in zip(mu_syms, h_exprs):
        L = L + mu * h

    if g_exprs:
        steps.append(
            {
                "step": 2,
                "title": "Lagrangian",
                "detail": f"\\mathcal{{L}} = {latex(L)}",
            }
        )

    grad_L = [sp.diff(L, X1), sp.diff(L, X2)]
    kkt_eqs = grad_L + list(g_exprs)
    if h_exprs:
        steps.append(
            {
                "step": 3,
                "title": "Kuhn–Tucker conditions",
                "detail": (
                    "\\nabla f + \\sum \\lambda_i \\nabla g_i + \\sum \\mu_j \\nabla h_j = 0,\\;"
                    "g_i=0,\\; h_j \\le 0,\\; \\mu_j \\ge 0,\\; \\mu_j h_j = 0"
                ),
            }
        )
    else:
        steps.append(
            {
                "step": 3,
                "title": "Lagrange stationarity",
                "detail": f"\\nabla \\mathcal{{L}} = 0,\\; g_i = 0",
            }
        )

    # Hessian of objective for classification
    H = sp.hessian(f_expr, (X1, X2))
    steps.append({"step": 4, "title": "Hessian of f", "detail": f"H_f = {latex(H)}"})

    stationary_points: list[dict[str, Any]] = []
    try:
        unknowns = [X1, X2] + list(lam_syms) + list(mu_syms)
        sols = sp.solve(kkt_eqs, unknowns, dict=True)
        for sol in sols[:8]:
            x1v = float(sol.get(X1, 0))
            x2v = float(sol.get(X2, 0))
            Hnum = np.array(H.subs({X1: x1v, X2: x2v}).evalf().tolist(), dtype=float).reshape(2, 2)
            ev = np.linalg.eigvalsh(Hnum)
            if ev[0] > 1e-8 and ev[1] > 1e-8:
                cls = "local minimum (H positive definite)"
            elif ev[0] < -1e-8 and ev[1] < -1e-8:
                cls = "local maximum (H negative definite)"
            else:
                cls = "saddle or inconclusive"
            stationary_points.append(
                {
                    "x1": x1v,
                    "x2": x2v,
                    "f": float(f_fn(x1v, x2v)),
                    "classification": cls,
                    "hessianEigenvalues": ev.tolist(),
                }
            )
    except Exception:
        pass

    # Numerical constrained optimum
    def obj(v):
        return float(f_fn(v[0], v[1]))

    cons = []
    for gf in g_fns:
        cons.append({"type": "eq", "fun": lambda v, gf=gf: gf(v[0], v[1])})
    for hf in h_fns:
        cons.append({"type": "ineq", "fun": lambda v, hf=hf: -hf(v[0], v[1])})

    x0 = [0.5, 0.5]
    if stationary_points:
        x0 = [stationary_points[0]["x1"], stationary_points[0]["x2"]]

    res = minimize(obj, x0, method="SLSQP", constraints=cons, options={"ftol": 1e-9, "maxiter": 200})
    optimum = {
        "x1": float(res.x[0]),
        "x2": float(res.x[1]),
        "f": float(res.fun),
        "success": bool(res.success),
    }

    # Plot grid
    x1g = np.linspace(-1, 6, 120)
    x2g = np.linspace(-1, 6, 120)
    X1g, X2g = np.meshgrid(x1g, x2g)
    Z = np.vectorize(lambda a, b: float(f_fn(a, b)))(X1g, X2g)
    feas = _feasible_mask(X1g, X2g, g_fns, h_fns)

    academic_style()
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9, 6))
    cf = ax.contour(X1g, X2g, Z, levels=18, cmap="viridis", alpha=0.85)
    plt.colorbar(cf, ax=ax, label="f(x₁,x₂)")
    if np.any(feas):
        ax.contourf(X1g, X2g, feas.astype(float), levels=[0.5, 1.5], colors=["#22d3ee"], alpha=0.18)
    ax.scatter(optimum["x1"], optimum["x2"], c="#fbbf24", s=120, zorder=6, edgecolors="white", label="Optimum")
    for p in stationary_points:
        ax.scatter(p["x1"], p["x2"], c="#a78bfa", s=60, zorder=5)
    ax.set_xlabel("x₁")
    ax.set_ylabel("x₂")
    ax.set_title("Constrained Extremum — contours & feasible region")
    ax.legend(loc="best")
    ax.grid(True, alpha=0.35)
    img = fig_to_base64(fig)

    plot_data = {
        "contour": {
            "x": x1g.tolist(),
            "y": x2g.tolist(),
            "z": Z.tolist(),
        },
        "feasible": {
            "x": X1g[feas].tolist() if np.any(feas) else [],
            "y": X2g[feas].tolist() if np.any(feas) else [],
        },
        "optimum": optimum,
        "stationary": stationary_points,
    }

    return {
        "method": "constrained-extremum",
        "input": {"objective": objective, "equalities": equalities, "inequalities": inequalities},
        "iterations": steps,
        "result": {
            "optimum": optimum,
            "stationaryPoints": stationary_points,
        },
        "error": None,
        "converged": optimum["success"],
        "formulas": {
            "lagrangian": latex(L),
            "hessian": latex(H),
            "gradient_f": latex(sp.Matrix([sp.diff(f_expr, X1), sp.diff(f_expr, X2)])),
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
