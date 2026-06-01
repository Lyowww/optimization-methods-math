"use client";

import dynamic from "next/dynamic";
import type { PlotParams } from "react-plotly.js";
import { useApp } from "@/context/AppProviders";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function PlotlyChart({ data, layout, config }: Partial<PlotParams>) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const text = isDark ? "#e2e8f0" : "#0f172a";
  const grid = isDark ? "#334155" : "#cbd5e1";
  const paper = isDark ? "rgba(15,23,42,0.3)" : "rgba(248,250,252,0.5)";

  return (
    <div className="plot-container">
      <Plot
        data={data || []}
        layout={{
          autosize: true,
          margin: { l: 50, r: 24, t: 48, b: 48 },
          paper_bgcolor: paper,
          plot_bgcolor: paper,
          font: { color: text, family: "system-ui, sans-serif", size: 12 },
          xaxis: { gridcolor: grid, zerolinecolor: grid, color: text },
          yaxis: { gridcolor: grid, zerolinecolor: grid, color: text },
          hovermode: "closest",
          showlegend: true,
          legend: { bgcolor: "transparent", font: { color: text } },
          ...layout,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          ...config,
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%", minHeight: 380 }}
      />
    </div>
  );
}
