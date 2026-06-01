"""Shared SymPy expression parsing for optimization solvers."""
from __future__ import annotations

import sympy as sp
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

_TRANSFORMATIONS = standard_transformations + (implicit_multiplication_application,)

X1, X2 = sp.symbols("x1 x2", real=True)
X, Y = sp.symbols("x y", real=True)
YP = sp.Symbol("yp", real=True)


def parse_2d(expr_str: str) -> sp.Expr:
    return parse_expr(expr_str.replace("^", "**"), local_dict={"x1": X1, "x2": X2}, transformations=_TRANSFORMATIONS)


def parse_xy(expr_str: str) -> sp.Expr:
    return parse_expr(
        expr_str.replace("^", "**").replace("y'", "yp").replace("yprime", "yp"),
        local_dict={"x": X, "y": Y, "yp": YP},
        transformations=_TRANSFORMATIONS,
    )


def latex(expr: sp.Expr) -> str:
    return sp.latex(expr)


def lambdify_2d(expr: sp.Expr):
    return sp.lambdify((X1, X2), expr, modules=["numpy"])
