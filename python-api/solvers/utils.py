"""Shared utilities for solvers and plotting."""
import base64
import io
import os
from typing import Any

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")
os.environ.setdefault("MPLBACKEND", "Agg")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np


def fig_to_base64(fig: plt.Figure, dpi: int = 150) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=dpi, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def academic_style():
    plt.style.use("seaborn-v0_8-whitegrid")
    plt.rcParams.update(
        {
            "figure.facecolor": "#0f172a",
            "axes.facecolor": "#1e293b",
            "axes.edgecolor": "#94a3b8",
            "axes.labelcolor": "#e2e8f0",
            "text.color": "#e2e8f0",
            "xtick.color": "#cbd5e1",
            "ytick.color": "#cbd5e1",
            "grid.color": "#334155",
            "legend.facecolor": "#1e293b",
            "legend.edgecolor": "#475569",
            "font.size": 11,
        }
    )


def safe_matrix(data: list) -> np.ndarray:
    arr = np.array(data, dtype=float)
    if arr.ndim != 2:
        raise ValueError("Matrix must be 2-dimensional")
    return arr


def safe_vector(data: list, name: str = "vector") -> np.ndarray:
    arr = np.array(data, dtype=float).flatten()
    if arr.ndim != 1:
        raise ValueError(f"{name} must be a 1-dimensional array")
    return arr
