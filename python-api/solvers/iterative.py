"""Jacobi and Gauss-Seidel iterative solvers."""
from typing import Any, Literal

import numpy as np

from .utils import academic_style, fig_to_base64, safe_matrix, safe_vector


def _is_diagonally_dominant(A: np.ndarray) -> bool:
    n = A.shape[0]
    for i in range(n):
        if abs(A[i, i]) <= np.sum(np.abs(A[i, :])) - abs(A[i, i]):
            return False
    return True


def _exact_solution(A: np.ndarray, b: np.ndarray) -> np.ndarray | None:
    try:
        if np.linalg.cond(A) < 1e12:
            return np.linalg.solve(A, b)
    except np.linalg.LinAlgError:
        pass
    return None


def solve_iterative(
    A_list: list,
    b_list: list,
    x0_list: list,
    tolerance: float = 1e-6,
    max_iterations: int = 100,
    method: Literal["jacobi", "gauss-seidel"] = "jacobi",
) -> dict[str, Any]:
    A = safe_matrix(A_list)
    b = safe_vector(b_list, "b")
    n, m = A.shape
    if n != m:
        raise ValueError("Matrix A must be square")
    if len(b) != n:
        raise ValueError("Vector b dimension must match matrix size")
    x = safe_vector(x0_list, "x0")
    if len(x) != n:
        raise ValueError("Initial vector x0 dimension must match matrix size")

    if np.any(np.abs(np.diag(A)) < 1e-14):
        raise ValueError("Matrix has zero diagonal element — division by zero.")

    D = np.diag(np.diag(A))
    L = -np.tril(A, -1)
    U = -np.triu(A, 1)
    D_inv = np.linalg.inv(D)
    exact = _exact_solution(A, b)

    iterations = []
    x_curr = x.copy()
    converged = False

    for k in range(max_iterations):
        if method == "jacobi":
            x_new = D_inv @ (b + (L + U) @ x_curr)
        else:
            x_new = x_curr.copy()
            for i in range(n):
                sigma = b[i]
                for j in range(n):
                    if j != i:
                        sigma -= A[i, j] * x_new[j]
                x_new[i] = sigma / A[i, i]

        residual = b - A @ x_new
        res_norm = float(np.linalg.norm(residual))
        error = float(np.linalg.norm(x_new - x_curr))
        row = {
            "k": k,
            "x": x_new.tolist(),
            "residual_norm": res_norm,
            "error": error,
        }
        if exact is not None:
            row["exact_error"] = float(np.linalg.norm(x_new - exact))
        iterations.append(row)

        if error < tolerance and res_norm < tolerance:
            converged = True
            x_curr = x_new
            break
        x_curr = x_new

    errors = [it["error"] for it in iterations]
    residuals = [it["residual_norm"] for it in iterations]
    ks = list(range(len(iterations)))

    plot_data = {
        "convergence": {"x": ks, "y": errors, "name": "||x^{k+1} - x^k||"},
        "residual": {"x": ks, "y": residuals, "name": "||b - Ax||"},
        "exact_errors": [it.get("exact_error") for it in iterations] if exact is not None else None,
        "solution": x_curr.tolist(),
        "exact": exact.tolist() if exact is not None else None,
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].semilogy(ks, errors, "o-", color="#22d3ee", label="Iteration error")
    if exact is not None:
        axes[0].semilogy(ks, [it.get("exact_error", 0) for it in iterations], "s--", color="#f472b6", label="Error vs exact")
    axes[0].set_xlabel("Iteration k")
    axes[0].set_ylabel("Error")
    axes[0].set_title(f"{method.title()} — Convergence")
    axes[0].legend()
    axes[0].grid(True, alpha=0.4)

    axes[1].semilogy(ks, residuals, "^-", color="#a78bfa", label="Residual norm")
    axes[1].set_xlabel("Iteration k")
    axes[1].set_ylabel("||r||")
    axes[1].set_title("Residual Norm")
    axes[1].legend()
    axes[1].grid(True, alpha=0.4)
    fig.tight_layout()
    img = fig_to_base64(fig)

    return {
        "method": method,
        "input": {"A": A_list, "b": b_list, "x0": x0_list, "tolerance": tolerance, "max_iterations": max_iterations},
        "iterations": iterations,
        "result": {"x": x_curr.tolist(), "residual_norm": residuals[-1] if residuals else None},
        "error": errors[-1] if errors else None,
        "converged": converged,
        "formulas": {
            "jacobi": "x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j\\neq i} a_{ij} x_j^{(k)}\\right)",
            "gauss-seidel": "x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j<i} a_{ij}x_j^{(k+1)} - \\sum_{j>i} a_{ij}x_j^{(k)}\\right)",
        },
        "diagonally_dominant": _is_diagonally_dominant(A),
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }


def compare_jacobi_gauss(
    A_list: list,
    b_list: list,
    x0_list: list,
    tolerance: float = 1e-6,
    max_iterations: int = 100,
) -> dict[str, Any]:
    jac = solve_iterative(A_list, b_list, x0_list, tolerance, max_iterations, "jacobi")
    gs = solve_iterative(A_list, b_list, x0_list, tolerance, max_iterations, "gauss-seidel")
    plot_data = {
        "jacobi_errors": jac["plotData"]["convergence"]["y"],
        "gs_errors": gs["plotData"]["convergence"]["y"],
        "jacobi_residuals": jac["plotData"]["residual"]["y"],
        "gs_residuals": gs["plotData"]["residual"]["y"],
    }
    faster = "gauss-seidel" if len(gs["iterations"]) < len(jac["iterations"]) else "jacobi"
    if len(gs["iterations"]) == len(jac["iterations"]):
        faster = "tie"
    return {
        "jacobi": jac,
        "gauss_seidel": gs,
        "comparison": {"faster": faster, "jacobi_iters": len(jac["iterations"]), "gs_iters": len(gs["iterations"])},
        "plotData": plot_data,
    }
