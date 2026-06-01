"""FastAPI backend for Numerical Methods Visual Lab."""
import os
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from solvers import (
    analyze_problem,
    compare_jacobi_gauss,
    solve_iterative,
    solve_lagrange,
    solve_least_squares,
    solve_lu,
    solve_newton,
)

app = FastAPI(title="Numerical Methods Visual Lab API", version="1.0.0")


def _cors_origins() -> list[str]:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    vercel_url = os.getenv("VERCEL_URL")
    if vercel_url:
        origins.append(f"https://{vercel_url}")
    branch_url = os.getenv("VERCEL_BRANCH_URL")
    if branch_url:
        origins.append(f"https://{branch_url}")
    extra = os.getenv("ALLOWED_ORIGINS", "")
    origins.extend(o.strip() for o in extra.split(",") if o.strip())
    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewtonRequest(BaseModel):
    function: str
    derivative: Optional[str] = None
    x0: float
    tolerance: float = 1e-6
    max_iterations: int = 50
    numerical_derivative: bool = False


class IterativeRequest(BaseModel):
    A: list[list[float]]
    b: list[float]
    x0: list[float]
    tolerance: float = 1e-6
    max_iterations: int = 100


class PointsRequest(BaseModel):
    points: list[dict[str, float]]
    show_basis: bool = False


class LURequest(BaseModel):
    A: list[list[float]]
    b: list[float]


class AnalyzeRequest(BaseModel):
    text: str


class CompareRequest(IterativeRequest):
    pass


@app.get("/")
def root():
    return {"status": "ok", "service": "numerical-methods-api"}


@app.post("/api/newton")
def api_newton(req: NewtonRequest) -> dict[str, Any]:
    try:
        return solve_newton(
            req.function,
            req.derivative,
            req.x0,
            req.tolerance,
            req.max_iterations,
            req.numerical_derivative,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/jacobi")
def api_jacobi(req: IterativeRequest) -> dict[str, Any]:
    try:
        return solve_iterative(req.A, req.b, req.x0, req.tolerance, req.max_iterations, "jacobi")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/gauss-seidel")
def api_gauss_seidel(req: IterativeRequest) -> dict[str, Any]:
    try:
        return solve_iterative(req.A, req.b, req.x0, req.tolerance, req.max_iterations, "gauss-seidel")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/gauss-seidel/compare")
def api_compare(req: CompareRequest) -> dict[str, Any]:
    try:
        return compare_jacobi_gauss(req.A, req.b, req.x0, req.tolerance, req.max_iterations)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/interpolation/lagrange")
def api_lagrange(req: PointsRequest) -> dict[str, Any]:
    try:
        return solve_lagrange(req.points, req.show_basis)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/least-squares")
def api_least_squares(req: PointsRequest) -> dict[str, Any]:
    try:
        return solve_least_squares(req.points)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/lu")
def api_lu(req: LURequest) -> dict[str, Any]:
    try:
        return solve_lu(req.A, req.b)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/analyze-problem")
def api_analyze(req: AnalyzeRequest) -> dict[str, Any]:
    try:
        return analyze_problem(req.text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
