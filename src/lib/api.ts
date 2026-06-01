/**
 * API base URL:
 * - Production (Vercel): same origin — /api/* rewrites to Python serverless
 * - Local dev: Next.js rewrites /api/* → uvicorn (see next.config.ts)
 * - Override: set NEXT_PUBLIC_API_URL (e.g. external API)
 */
function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "";
}

const API_BASE = getApiBase();

export interface ApiResponse {
  method: string;
  input: Record<string, unknown>;
  iterations: Record<string, unknown>[];
  result: Record<string, unknown>;
  error: number | null;
  converged: boolean;
  formulas: Record<string, string>;
  plotData: Record<string, unknown>;
  matplotlibImageBase64?: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data as T;
}

export const api = {
  newton: (body: unknown) => post<ApiResponse>("/api/newton", body),
  jacobi: (body: unknown) => post<ApiResponse>("/api/jacobi", body),
  gaussSeidel: (body: unknown) => post<ApiResponse>("/api/gauss-seidel", body),
  compare: (body: unknown) => post<Record<string, unknown>>("/api/gauss-seidel/compare", body),
  lagrange: (body: unknown) => post<ApiResponse>("/api/interpolation/lagrange", body),
  leastSquares: (body: unknown) => post<ApiResponse>("/api/least-squares", body),
  lu: (body: unknown) => post<ApiResponse>("/api/lu", body),
  analyze: (text: string) => post<AnalyzeResult>("/api/analyze-problem", { text }),
};

export interface AnalyzeResult {
  method: string | null;
  confidence: number;
  parsed: Record<string, unknown>;
  ready: boolean;
}
