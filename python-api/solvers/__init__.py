from .newton import solve_newton
from .iterative import solve_iterative, compare_jacobi_gauss
from .lagrange import solve_lagrange
from .least_squares import solve_least_squares
from .lu import solve_lu
from .analyzer import analyze_problem

__all__ = [
    "solve_newton",
    "solve_iterative",
    "compare_jacobi_gauss",
    "solve_lagrange",
    "solve_least_squares",
    "solve_lu",
    "analyze_problem",
]
