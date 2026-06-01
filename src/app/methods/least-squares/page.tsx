"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { leastSquaresPlotData } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { useQueryAutoRun } from "@/hooks/useQueryAutoRun";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";

type Point = { x: number; y: number };

function LeastSquaresLab() {
  const { tr } = useApp();
  const meta = tr.methodsList["least-squares"];
  const ex = EXAMPLES["least-squares"] as { points: Point[] };

  const [points, setPoints] = useState<Point[]>(ex.points);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.leastSquares({ points });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [points]);

  useQueryAutoRun((parsed) => {
    if (parsed.points) setPoints(parsed.points as Point[]);
    setTimeout(() => run(), 100);
  });

  const plot = useMemo(() => (data ? leastSquaresPlotData(data.plotData) : null), [data]);

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
          onExportPdf={() => exportElementToPdf("lab-export-root", "least-squares.pdf")}
          onDownloadPng={() => data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "least-squares.png")}
        />
      }
      input={
        <div className="space-y-3">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => setPoints(ex.points)}>
            {tr.example}
          </button>
          {points.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input type="number" className="input-field w-20 font-mono text-xs" value={p.x} onChange={(e) => setPoints((prev) => prev.map((pt, j) => (j === i ? { ...pt, x: +e.target.value } : pt)))} />
              <input type="number" className="input-field w-20 font-mono text-xs" value={p.y} onChange={(e) => setPoints((prev) => prev.map((pt, j) => (j === i ? { ...pt, y: +e.target.value } : pt)))} />
              <button type="button" className="text-xs text-red-400" onClick={() => setPoints((prev) => prev.filter((_, j) => j !== i))} disabled={points.length <= 2}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => setPoints((prev) => [...prev, { x: prev.length + 1, y: 0 }])}>
            {tr.addPoint}
          </button>
        </div>
      }
      chart={
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.interactivePlot}</h3>
          {plot ? <PlotlyChart data={plot.data} layout={plot.layout} /> : <div className="flex h-[380px] items-center justify-center text-sm text-lab-muted">—</div>}
        </div>
      }
      results={
        <ResultPanel data={data} error={error}>
          {data?.result && (
            <p className="text-sm font-mono text-cyan-400">{String((data.result as { equation: string }).equation)}</p>
          )}
        </ResultPanel>
      }
    />
  );
}

export default function LeastSquaresPage() {
  return (
    <Suspense>
      <LeastSquaresLab />
    </Suspense>
  );
}
