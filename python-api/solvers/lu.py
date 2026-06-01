"""LU decomposition with forward/back substitution."""
from typing import Any

import numpy as np

from .utils import academic_style, fig_to_base64, safe_matrix, safe_vector


def _lu_factorize(A: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    PA = LU via Doolittle elimination with partial pivoting.
    Avoids np.linalg.lu (naming conflicts with this module on some deployments).
    """
    n = A.shape[0]
    U = A.astype(float).copy()
    L = np.eye(n, dtype=float)
    P = np.eye(n, dtype=float)

    for k in range(n - 1):
        pivot_row = k + int(np.argmax(np.abs(U[k:, k])))
        if abs(U[pivot_row, k]) < 1e-14:
            raise ValueError("Matrix is singular or near-singular — LU failed.")

        if pivot_row != k:
            U[[k, pivot_row]] = U[[pivot_row, k]]
            L[[k, pivot_row], :k] = L[[pivot_row, k], :k]
            P[[k, pivot_row]] = P[[pivot_row, k]]

        for i in range(k + 1, n):
            L[i, k] = U[i, k] / U[k, k]
            U[i, k:] -= L[i, k] * U[k, k:]

    return P, L, U


def solve_lu(A_list: list, b_list: list) -> dict[str, Any]:
    A = safe_matrix(A_list)
    b = safe_vector(b_list, "b")
    n, m = A.shape
    if n != m:
        raise ValueError("Matrix A must be square")
    if len(b) != n:
        raise ValueError("Dimension mismatch between A and b")

    P, L, U = _lu_factorize(A)
    Pb = P @ b

    y = np.zeros(n)
    steps_forward = []
    for i in range(n):
        y[i] = Pb[i] - np.dot(L[i, :i], y[:i])
        steps_forward.append({"step": i + 1, "y": y.copy().tolist()})

    x = np.zeros(n)
    steps_backward = []
    for i in range(n - 1, -1, -1):
        if abs(U[i, i]) < 1e-14:
            raise ValueError("Zero pivot on diagonal — cannot complete back substitution.")
        x[i] = (y[i] - np.dot(U[i, i + 1 :], x[i + 1 :])) / U[i, i]
        steps_backward.append({"step": n - i, "x": x.copy().tolist()})

    residual = float(np.linalg.norm(A @ x - b))

    plot_data = {
        "A": A.tolist(),
        "L": L.tolist(),
        "U": U.tolist(),
        "P": P.tolist(),
        "b": b.tolist(),
        "Pb": Pb.tolist(),
        "y": y.tolist(),
        "x": x.tolist(),
        "steps": {"forward": steps_forward, "backward": steps_backward},
    }

    academic_style()
    import matplotlib.pyplot as plt

    fig, axes = plt.subplots(1, 3, figsize=(12, 4))

    def heatmap(ax, M, title):
        im = ax.imshow(M, cmap="viridis", aspect="auto")
        ax.set_title(title)
        for i in range(M.shape[0]):
            for j in range(M.shape[1]):
                ax.text(j, i, f"{M[i, j]:.2g}", ha="center", va="center", color="white", fontsize=8)
        fig.colorbar(im, ax=ax, fraction=0.046)

    heatmap(axes[0], L, "L")
    heatmap(axes[1], U, "U")
    heatmap(axes[2], A, "A")
    fig.suptitle("LU Decomposition (PA = LU)")
    fig.tight_layout()
    img = fig_to_base64(fig)

    return {
        "method": "lu",
        "input": {"A": A_list, "b": b_list},
        "iterations": steps_forward + [{"phase": "backward", **s} for s in steps_backward],
        "result": {"x": x.tolist(), "L": L.tolist(), "U": U.tolist(), "P": P.tolist(), "y": y.tolist()},
        "error": residual,
        "converged": residual < 1e-8,
        "formulas": {
            "decomposition": "PA = LU",
            "forward": "Ly = Pb",
            "backward": "Ux = y",
        },
        "plotData": plot_data,
        "matplotlibImageBase64": img,
    }
