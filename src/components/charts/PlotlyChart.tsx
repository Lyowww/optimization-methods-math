"use client";

import dynamic from "next/dynamic";
import type { PlotParams } from "react-plotly.js";
import { useApp } from "@/context/AppProviders";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function PlotlyChart({ data, layout, config }: Partial<PlotParams>) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const text = isDark ? "#e2e8f0" : "#0f172a";
  const grid = isDark ? "#334155" : "#e2e8f0";
  const paper = isDark ? "rgba(2,6,23,0.4)" : "rgba(255,255,255,0.6)";

  return (
    <div className="h-full min-h-[280px] w-full sm:min-h-[360px]">
      <Plot
        data={data || []}
        layout={{
          autosize: true,
          margin: { l: 48, r: 20, t: 40, b: 48 },
          paper_bgcolor: paper,
          plot_bgcolor: paper,
          font: { color: text, family: "var(--font-body), system-ui, sans-serif", size: 12 },
          xaxis: { gridcolor: grid, zerolinecolor: grid, color: text, tickfont: { size: 11 } },
          yaxis: { gridcolor: grid, zerolinecolor: grid, color: text, tickfont: { size: 11 } },
          hovermode: "closest",
          hoverlabel: {
            bgcolor: isDark ? "#1e293b" : "#fff",
            bordercolor: isDark ? "#475569" : "#cbd5e1",
            font: { color: text, size: 12 },
          },
          showlegend: true,
          legend: {
            bgcolor: "transparent",
            font: { color: text, size: 11 },
            orientation: "h",
            y: 1.12,
            x: 0,
          },
          ...layout,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          scrollZoom: true,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
          toImageButtonOptions: { format: "png", filename: "optimization-plot", scale: 2 },
          ...config,
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%", minHeight: 280 }}
      />
    </div>
  );
}
