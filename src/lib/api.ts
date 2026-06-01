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

export interface ApiStep {
  step: number;
  title: string;
  detail: string;
}

export interface ApiResponse {
  method: string;
  input: Record<string, unknown>;
  iterations: ApiStep[];
  result: Record<string, unknown>;
  error: number | null;
  converged: boolean;
  formulas: Record<string, string>;
  plotData: Record<string, unknown>;
  matplotlibImageBase64?: string;
}

export interface LPConstraint {
  coeffs: number[];
  rhs: number;
  op: "<=" | ">=" | "=";
}

export interface LPPayload {
  sense: "max" | "min";
  objective: number[];
  constraints: LPConstraint[];
  bounds?: ([number | null, number | null] | null[])[];
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
  constrainedExtremum: (body: {
    objective: string;
    equalities?: string[];
    inequalities?: string[];
  }) => post<ApiResponse>("/api/constrained-extremum", body),

  linearProgramming: (body: LPPayload) =>
    post<ApiResponse>("/api/linear-programming", body),

  graphicalLp: (body: LPPayload) => post<ApiResponse>("/api/graphical-lp", body),

  calculusOfVariations: (body: {
    integrand: string;
    a: number;
    b: number;
    y_a: number;
    y_b: number;
  }) => post<ApiResponse>("/api/calculus-of-variations", body),
};
