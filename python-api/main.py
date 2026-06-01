"""FastAPI backend for Optimization Methods Visual Lab."""
import os
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from solvers import (
    solve_calculus_of_variations,
    solve_constrained_extremum,
    solve_graphical_lp,
    solve_linear_programming,
)

app = FastAPI(title="Optimization Methods Visual Lab API", version="2.0.0")


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


class ConstraintRow(BaseModel):
    coeffs: list[float]
    rhs: float
    op: Literal["<=", ">=", "="] = "<="


class LPRequest(BaseModel):
    sense: Literal["max", "min"] = "max"
    objective: list[float]
    constraints: list[ConstraintRow]
    bounds: list[list[float | None]] | None = None


class ConstrainedExtremumRequest(BaseModel):
    objective: str
    equalities: list[str] = Field(default_factory=list)
    inequalities: list[str] = Field(default_factory=list)


class CalculusRequest(BaseModel):
    integrand: str
    a: float
    b: float
    y_a: float
    y_b: float


@app.get("/")
def root():
    return {"status": "ok", "service": "optimization-methods-api"}


@app.post("/api/constrained-extremum")
def api_constrained_extremum(req: ConstrainedExtremumRequest) -> dict[str, Any]:
    try:
        return solve_constrained_extremum(req.objective, req.equalities, req.inequalities)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/linear-programming")
def api_linear_programming(req: LPRequest) -> dict[str, Any]:
    try:
        return solve_linear_programming(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/graphical-lp")
def api_graphical_lp(req: LPRequest) -> dict[str, Any]:
    try:
        return solve_graphical_lp(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post("/api/calculus-of-variations")
def api_calculus(req: CalculusRequest) -> dict[str, Any]:
    try:
        return solve_calculus_of_variations(req.integrand, req.a, req.b, req.y_a, req.y_b)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
