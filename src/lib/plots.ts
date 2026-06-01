import type { Data, Layout } from "plotly.js";
import type { ApiResponse } from "./api";

export function newtonPlotData(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const curve = pd.curve as { x: number[]; y: number[]; name: string };
  const tangents = (pd.tangents as { x: number[]; y: number[]; iteration: number }[]) || [];
  const points = (pd.points as { x: number; y: number; label?: string }[]) || [];
  const root = pd.root as { x: number; y: number };

  const data: Data[] = [
    {
      x: curve.x,
      y: curve.y,
      type: "scatter",
      mode: "lines",
      name: curve.name || "f(x)",
      line: { color: "#22d3ee", width: 2 },
      hovertemplate: "x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    },
    ...tangents.map((t, i) => ({
      x: t.x,
      y: t.y,
      type: "scatter" as const,
      mode: "lines" as const,
      name: `Tangent ${t.iteration ?? i}`,
      line: { dash: "dash" as const, width: 1.5 },
      hovertemplate: "Tangent<br>x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    })),
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "markers",
      name: "Iterations",
      marker: { color: "#fbbf24", size: 10 },
      hovertemplate: "%{text}<br>x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
      text: points.map((p) => p.label || ""),
    },
  ];

  if (root) {
    data.push({
      x: [root.x],
      y: [root.y],
      type: "scatter",
      mode: "markers",
      name: `Root ≈ ${root.x.toFixed(6)}`,
      marker: { color: "#34d399", size: 12, symbol: "star" },
    });
  }

  return {
    data,
    layout: { title: "Newton-Raphson", xaxis: { title: "x" }, yaxis: { title: "f(x)" } },
  };
}

export function iterativePlotData(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const conv = pd.convergence as { x: number[]; y: number[]; name: string };
  const res = pd.residual as { x: number[]; y: number[]; name: string };
  const exact = pd.exact_errors as number[] | null;

  const data: Data[] = [
    {
      x: conv.x,
      y: conv.y,
      type: "scatter",
      mode: "lines+markers",
      name: conv.name,
      line: { color: "#22d3ee" },
      hovertemplate: "k=%{x}<br>error=%{y:.6g}<extra></extra>",
    },
    {
      x: res.x,
      y: res.y,
      type: "scatter",
      mode: "lines+markers",
      name: res.name,
      yaxis: "y2",
      line: { color: "#a78bfa" },
      hovertemplate: "k=%{x}<br>||r||=%{y:.6g}<extra></extra>",
    },
  ];

  if (exact && exact[0] != null) {
    data.push({
      x: conv.x,
      y: exact,
      type: "scatter",
      mode: "lines+markers",
      name: "Error vs exact",
      line: { color: "#f472b6", dash: "dot" as const },
    });
  }

  return {
    data,
    layout: {
      title: "Convergence",
      xaxis: { title: "Iteration k" },
      yaxis: { title: "Error", type: "log" },
      yaxis2: { title: "Residual", overlaying: "y", side: "right", type: "log" },
    },
  };
}

export function comparePlotData(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const ks = (pd.jacobi_errors as number[]).map((_, i) => i);
  return {
    data: [
      {
        x: ks,
        y: pd.jacobi_errors as number[],
        type: "scatter",
        mode: "lines+markers",
        name: "Jacobi",
        line: { color: "#22d3ee" },
      },
      {
        x: ks.slice(0, (pd.gs_errors as number[]).length),
        y: pd.gs_errors as number[],
        type: "scatter",
        mode: "lines+markers",
        name: "Gauss-Seidel",
        line: { color: "#f472b6" },
      },
    ],
    layout: { title: "Jacobi vs Gauss-Seidel", yaxis: { type: "log", title: "Error" } },
  };
}

export function lagrangePlotData(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const curve = pd.curve as { x: number[]; y: number[] };
  const points = pd.points as { x: number; y: number }[];
  const basis = (pd.basis as { x: number[]; y: number[]; name: string }[]) || [];

  const data: Data[] = [
    {
      x: curve.x,
      y: curve.y,
      type: "scatter",
      mode: "lines",
      name: "P(x)",
      line: { color: "#22d3ee", width: 2 },
      hovertemplate: "x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    },
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "markers",
      name: "Data",
      marker: { color: "#fbbf24", size: 12 },
      hovertemplate: "x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    },
    ...basis.map((b) => ({
      x: b.x,
      y: b.y,
      type: "scatter" as const,
      mode: "lines" as const,
      name: b.name,
      line: { dash: "dot" as const, width: 1 },
    })),
  ];

  return { data, layout: { title: "Lagrange Interpolation" } };
}

export function leastSquaresPlotData(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const points = pd.points as { x: number; y: number }[];
  const line = pd.line as { x: number[]; y: number[]; name: string };
  const residuals = pd.residuals as { x: number[]; y: number[] }[];

  const data: Data[] = [
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "markers",
      name: "Data",
      marker: { color: "#fbbf24", size: 10 },
      hovertemplate: "x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    },
    {
      x: line.x,
      y: line.y,
      type: "scatter",
      mode: "lines",
      name: line.name,
      line: { color: "#22d3ee", width: 2 },
    },
    ...residuals.map((r, i) => ({
      x: r.x,
      y: r.y,
      type: "scatter" as const,
      mode: "lines" as const,
      name: i === 0 ? "Residuals" : undefined,
      showlegend: i === 0,
      line: { color: "#f87171", dash: "dash" as const, width: 1 },
      hovertemplate: "residual<br>x=%{x:.6g}<br>y=%{y:.6g}<extra></extra>",
    })),
  ];

  return { data, layout: { title: "Least Squares Fit" } };
}

export function buildPlotFromResponse(data: ApiResponse) {
  const pd = data.plotData;
  switch (data.method) {
    case "newton":
      return newtonPlotData(pd);
    case "jacobi":
    case "gauss-seidel":
      return iterativePlotData(pd);
    case "lagrange":
      return lagrangePlotData(pd);
    case "least-squares":
      return leastSquaresPlotData(pd);
    default:
      return { data: [], layout: {} };
  }
}
