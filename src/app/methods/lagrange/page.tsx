"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { lagrangePlotData } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { useQueryAutoRun } from "@/hooks/useQueryAutoRun";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";

type Point = { x: number; y: number };

function LagrangeLab() {
  const { tr } = useApp();
  const meta = tr.methodsList.lagrange;
  const ex = EXAMPLES.lagrange as { points: Point[]; show_basis: boolean };

  const [points, setPoints] = useState<Point[]>(ex.points);
  const [showBasis, setShowBasis] = useState(ex.show_basis);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.lagrange({ points, show_basis: showBasis });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [points, showBasis]);

  useQueryAutoRun((parsed) => {
    if (parsed.points) setPoints(parsed.points as Point[]);
    setTimeout(() => run(), 100);
  });

  const plot = useMemo(() => (data ? lagrangePlotData(data.plotData) : null), [data]);

  const updatePoint = (i: number, field: "x" | "y", val: number) => {
    setPoints((prev) => prev.map((p, j) => (j === i ? { ...p, [field]: val } : p)));
  };

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => { setPoints(ex.points); setData(null); }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "lagrange.pdf")}
          onDownloadPng={() => data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "lagrange.png")}
        />
      }
      input={
        <div className="space-y-3">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => setPoints(ex.points)}>
            {tr.example}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showBasis} onChange={(e) => setShowBasis(e.target.checked)} />
            {tr.showBasis}
          </label>
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="number" className="input-field w-20 font-mono text-xs" value={p.x} onChange={(e) => updatePoint(i, "x", +e.target.value)} />
              <input type="number" className="input-field w-20 font-mono text-xs" value={p.y} onChange={(e) => updatePoint(i, "y", +e.target.value)} />
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => setPoints((prev) => prev.filter((_, j) => j !== i))}
                disabled={points.length <= 2}
              >
                {tr.removePoint}
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary w-full text-xs"
            onClick={() => setPoints((prev) => [...prev, { x: prev.length + 1, y: 0 }])}
          >
            {tr.addPoint}
          </button>
          <p className="text-xs text-lab-muted">Edit coordinates above, then run. Drag on chart after run (re-run to refresh curve).</p>
        </div>
      }
      chart={
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.interactivePlot}</h3>
          {plot ? (
            <PlotlyChart data={plot.data} layout={plot.layout} />
          ) : (
            <div className="flex h-[380px] items-center justify-center text-sm text-lab-muted">—</div>
          )}
        </div>
      }
      results={<ResultPanel data={data} error={error} />}
    />
  );
}

export default function LagrangePage() {
  return (
    <Suspense>
      <LagrangeLab />
    </Suspense>
  );
}
