import type { Data, Layout } from "plotly.js";

export function constrainedExtremumPlot(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const contour = pd.contour as { x: number[]; y: number[]; z: number[][] };
  const feas = pd.feasible as { x: number[]; y: number[] };
  const opt = pd.optimum as { x1: number; x2: number; f: number };
  const stat = (pd.stationary as { x1: number; x2: number }[]) || [];

  const data: Data[] = [
    {
      type: "contour",
      x: contour.x,
      y: contour.y,
      z: contour.z,
      colorscale: "Viridis",
      name: "f(x₁,x₂)",
      hovertemplate: "x₁=%{x}<br>x₂=%{y}<br>f=%{z:.4g}<extra></extra>",
    },
  ];

  if (feas.x?.length) {
    data.push({
      type: "scatter",
      mode: "markers",
      x: feas.x,
      y: feas.y,
      marker: { size: 3, color: "rgba(34,211,238,0.35)" },
      name: "Feasible region",
      hoverinfo: "skip",
    });
  }

  data.push({
    type: "scatter",
    mode: "markers",
    x: [opt.x1],
    y: [opt.x2],
    marker: { size: 14, color: "#fbbf24", line: { color: "#fff", width: 2 } },
    name: `Optimum f≈${opt.f?.toFixed(4)}`,
    hovertemplate: `x₁=%{x}<br>x₂=%{y}<extra></extra>`,
  });

  if (stat.length) {
    data.push({
      type: "scatter",
      mode: "markers",
      x: stat.map((s) => s.x1),
      y: stat.map((s) => s.x2),
      marker: { size: 9, color: "#a78bfa", symbol: "diamond" },
      name: "Stationary points",
    });
  }

  return {
    data,
    layout: {
      title: "Constrained Extremum",
      xaxis: { title: "x₁" },
      yaxis: { title: "x₂" },
      dragmode: "zoom",
    },
  };
}

export function lpPlot(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const lines = (pd.constraintLines as { x: number[]; y: number[]; name: string }[]) || [];
  const opt = pd.optimum as { x1: number; x2: number; z: number };
  const verts = (pd.vertices as { x1: number; x2: number }[]) || [];

  const data: Data[] = lines.map((l) => ({
    type: "scatter",
    mode: "lines",
    x: l.x,
    y: l.y,
    name: l.name,
    hovertemplate: "%{fullData.name}<br>x₁=%{x}<br>x₂=%{y}<extra></extra>",
  }));

  if (verts.length) {
    data.push({
      type: "scatter",
      mode: "lines",
      x: [...verts.map((v) => v.x1), verts[0].x1],
      y: [...verts.map((v) => v.x2), verts[0].x2],
      fill: "toself",
      fillcolor: "rgba(34,211,238,0.12)",
      line: { color: "rgba(34,211,238,0.5)" },
      name: "Feasible polygon",
      hoverinfo: "skip",
    });
  }

  data.push({
    type: "scatter",
    mode: "markers",
    x: [opt.x1],
    y: [opt.x2],
    marker: { size: 14, color: "#fbbf24", line: { color: "#fff", width: 2 } },
    name: `Optimum z=${opt.z?.toFixed(4)}`,
  });

  return {
    data,
    layout: {
      title: "Linear Programming",
      xaxis: { title: "x₁", rangemode: "tozero" },
      yaxis: { title: "x₂", rangemode: "tozero" },
    },
  };
}

export function graphicalLpPlot(
  pd: Record<string, unknown>,
  frameIndex: number
): { data: Data[]; layout: Partial<Layout> } {
  const base = lpPlot(pd);
  const frames = (pd.objectiveFrames as { x: number[]; y: number[]; level: number }[]) || [];
  if (frames.length) {
    const f = frames[Math.min(frameIndex, frames.length - 1)];
    base.data.push({
      type: "scatter",
      mode: "lines",
      x: f.x,
      y: f.y,
      line: { color: "#fbbf24", width: 2, dash: "dash" },
      name: `Objective z=${f.level.toFixed(3)}`,
    });
  }
  base.layout = { ...base.layout, title: "Graphical Linear Programming" };
  return base;
}

export function calculusPlot(pd: Record<string, unknown>): { data: Data[]; layout: Partial<Layout> } {
  const curve = pd.curve as { x: number[]; y: number[] };
  const bounds = pd.boundaries as { x: number; y: number }[];
  const J = pd.functionalValue as number;

  return {
    data: [
      {
        type: "scatter",
        mode: "lines",
        x: curve.x,
        y: curve.y,
        name: "Extremal y(x)",
        line: { color: "#22d3ee", width: 2.5 },
        hovertemplate: "x=%{x}<br>y=%{y:.4g}<extra></extra>",
      },
      {
        type: "scatter",
        mode: "markers",
        x: bounds.map((b) => b.x),
        y: bounds.map((b) => b.y),
        marker: { size: 12, color: "#fbbf24" },
        name: "Boundary",
      },
    ],
    layout: {
      title: `Calculus of Variations — J[y*] ≈ ${J?.toFixed(6)}`,
      xaxis: { title: "x" },
      yaxis: { title: "y" },
    },
  };
}
