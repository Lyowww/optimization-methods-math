"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { PlotParams } from "react-plotly.js";
import { useApp } from "@/context/AppProviders";
import { useLabTab } from "@/context/LabTabContext";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyChartProps extends Partial<PlotParams> {
  /** Override visibility; defaults to lab graph tab being active. */
  visible?: boolean;
}

export function PlotlyChart({ data, layout, config, visible }: PlotlyChartProps) {
  const { theme } = useApp();
  const labTab = useLabTab();
  const isVisible = visible ?? labTab === "graph";
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const text = isDark ? "#e2e8f0" : "#0f172a";
  const grid = isDark ? "#334155" : "#e2e8f0";
  const paper = isDark ? "rgba(2,6,23,0.4)" : "rgba(255,255,255,0.6)";

  useEffect(() => {
    if (!isVisible) return;
    const fire = () => window.dispatchEvent(new Event("resize"));
    const t1 = requestAnimationFrame(fire);
    const t2 = window.setTimeout(fire, 150);
    const t3 = window.setTimeout(fire, 400);
    return () => {
      cancelAnimationFrame(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isVisible, data, theme, layout]);

  return (
    <div ref={wrapRef} className="h-[min(420px,55vh)] min-h-[280px] w-full sm:min-h-[360px]">
      <Plot
        data={data || []}
        layout={{
          autosize: true,
          margin: { l: 52, r: 24, t: 48, b: 52 },
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
            y: 1.14,
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
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
