"""Natural language problem analyzer."""
import ast
import re
from typing import Any, Optional


METHOD_KEYWORDS = {
    "newton": ["newton", "newton-raphson", "newton raphson", "root finding"],
    "jacobi": ["jacobi"],
    "gauss-seidel": ["gauss-seidel", "gauss seidel", "gaussseidel", "seidel"],
    "lagrange": ["lagrange", "interpolation"],
    "least-squares": ["least squares", "least-squares", "linear regression", "fitting"],
    "lu": ["lu", "lu decomposition", "lu factorization"],
}


def _parse_matrix(text: str) -> Optional[list]:
    patterns = [
        r"\[\s*\[[^\]]+\](?:\s*,\s*\[[^\]]+\])*\s*\]",
        r"\(\s*\([^)]+\)(?:\s*,\s*\([^)]+\))*\s*\)",
    ]
    for pat in patterns:
        m = re.search(pat, text.replace("\n", " "))
        if m:
            s = m.group(0).replace("(", "[").replace(")", "]")
            try:
                return ast.literal_eval(s)
            except (ValueError, SyntaxError):
                pass
    return None


def _parse_vector(text: str) -> Optional[list]:
    m = re.search(r"\[\s*[\d\s.,\-eE+]+\s*\]", text)
    if m:
        try:
            return ast.literal_eval(m.group(0))
        except (ValueError, SyntaxError):
            pass
    return None


def _parse_points(text: str) -> Optional[list[dict]]:
    pairs = re.findall(r"\(\s*([\d.\-eE+]+)\s*,\s*([\d.\-eE+]+)\s*\)", text)
    if len(pairs) >= 2:
        return [{"x": float(a), "y": float(b)} for a, b in pairs]
    return None


def _detect_method(text: str) -> Optional[str]:
    lower = text.lower()
    for method, keywords in METHOD_KEYWORDS.items():
        for kw in keywords:
            if kw in lower:
                return method
    return None


def _parse_float(patterns: list[str], text: str, default: Optional[float] = None) -> Optional[float]:
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            return float(m.group(1))
    return default


def analyze_problem(text: str) -> dict[str, Any]:
    method = _detect_method(text)
    if not method:
        method = "jacobi" if "system" in text.lower() or "ax=b" in text.lower().replace(" ", "") else None

    result: dict[str, Any] = {"method": method, "confidence": 0.7 if method else 0.0, "parsed": {}}

    tol = _parse_float([r"tolerance\s*[=:]\s*([\d.eE+\-]+)", r"tol\s*[=:]\s*([\d.eE+\-]+)"], text, 1e-6)
    max_it = _parse_float(
        [r"max\s*iter(?:ations)?\s*[=:]\s*(\d+)", r"max\s*=\s*(\d+)"],
        text,
        50 if method == "newton" else 100,
    )
    if max_it is not None:
        result["parsed"]["max_iterations"] = int(max_it)
    if tol is not None:
        result["parsed"]["tolerance"] = tol

    matrix = _parse_matrix(text)
    if matrix:
        result["parsed"]["A"] = matrix

    # Multiple vectors: b, x0
    vectors = re.findall(r"\b([bx])(?:\s*0)?\s*=\s*(\[[^\]]+\])", text, re.I)
    for label, vec_str in vectors:
        try:
            vec = ast.literal_eval(vec_str)
            key = "x0" if label.lower().startswith("x") else "b"
            result["parsed"][key] = vec
        except (ValueError, SyntaxError):
            pass

    if "b" not in result["parsed"]:
        b = _parse_vector(text)
        if b and method in ("jacobi", "gauss-seidel", "lu"):
            result["parsed"]["b"] = b

    points = _parse_points(text)
    if points:
        result["parsed"]["points"] = points

    # Newton function
    fn = re.search(r"f\s*\(\s*x\s*\)\s*=\s*([^,;\n]+)", text, re.I)
    if fn:
        result["parsed"]["function"] = fn.group(1).strip()
    elif method == "newton":
        eq = re.search(r"([\w\d\^+\-*/().]+)\s*=\s*0", text)
        if eq:
            result["parsed"]["function"] = eq.group(1).strip()

    x0 = _parse_float([r"x0\s*=\s*([\d.\-eE+]+)", r"x_0\s*=\s*([\d.\-eE+]+)", r"initial\s*[=:]\s*([\d.\-eE+]+)"], text)
    if x0 is not None:
        result["parsed"]["x0"] = x0

    deriv = re.search(r"f\s*['′]\s*\(\s*x\s*\)\s*=\s*([^,;\n]+)", text, re.I)
    if deriv:
        result["parsed"]["derivative"] = deriv.group(1).strip()

    if method in ("jacobi", "gauss-seidel") and "x0" not in result["parsed"] and matrix:
        n = len(matrix)
        result["parsed"]["x0"] = [0.0] * n

    result["ready"] = bool(method) and (
        (method == "newton" and "function" in result["parsed"] and "x0" in result["parsed"])
        or (method in ("jacobi", "gauss-seidel", "lu") and "A" in result["parsed"] and "b" in result["parsed"])
        or (method in ("lagrange", "least-squares") and "points" in result["parsed"])
    )

    return result
