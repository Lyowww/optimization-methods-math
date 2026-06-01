"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { buildPlotFromResponse } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { useQueryAutoRun } from "@/hooks/useQueryAutoRun";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
function NewtonLab() {
  const { tr } = useApp();
  const meta = tr.methodsList.newton;
  const ex = EXAMPLES.newton as {
    function: string;
    derivative: string;
    x0: number;
    tolerance: number;
    max_iterations: number;
    numerical_derivative: boolean;
  };

  const [fn, setFn] = useState(ex.function);
  const [deriv, setDeriv] = useState(ex.derivative);
  const [x0, setX0] = useState(ex.x0);
  const [tol, setTol] = useState(ex.tolerance);
  const [maxIt, setMaxIt] = useState(ex.max_iterations);
  const [numDeriv, setNumDeriv] = useState(ex.numerical_derivative);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.newton({
        function: fn,
        derivative: deriv || null,
        x0,
        tolerance: tol,
        max_iterations: maxIt,
        numerical_derivative: numDeriv,
      });
      setData(res);
      setAnimStep(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fn, deriv, x0, tol, maxIt, numDeriv]);

  const applyAuto = useCallback(
    (parsed: Record<string, unknown>) => {
      if (parsed.function) setFn(String(parsed.function));
      if (parsed.derivative) setDeriv(String(parsed.derivative));
      if (parsed.x0 != null) setX0(Number(parsed.x0));
      if (parsed.tolerance != null) setTol(Number(parsed.tolerance));
      if (parsed.max_iterations != null) setMaxIt(Number(parsed.max_iterations));
      setTimeout(() => run(), 100);
    },
    [run]
  );

  useQueryAutoRun(applyAuto);

  const plot = useMemo(() => (data ? buildPlotFromResponse(data) : null), [data]);

  const animMarker = useMemo(() => {
    if (!data?.plotData) return null;
    const path = (data.plotData as { animationPath?: { x: number; y: number }[] }).animationPath;
    if (!path?.length) return null;
    const p = path[Math.min(animStep, path.length - 1)];
    return { x: [p.x], y: [0], type: "scatter" as const, mode: "markers" as const, name: "x_k → x_{k+1}", marker: { color: "#fb7185", size: 14, symbol: "diamond" } };
  }, [data, animStep]);

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setFn(ex.function);
            setDeriv(ex.derivative);
            setX0(ex.x0);
            setData(null);
            setError(null);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "newton-result.pdf")}
          onDownloadPng={() => data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "newton.png")}
        />
      }
      input={
        <div className="space-y-4">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => {
            setFn(ex.function); setDeriv(ex.derivative); setX0(ex.x0);
          }}>
            {tr.example}
          </button>
          <div>
            <label className="text-xs text-lab-muted">{tr.function}</label>
            <input className="input-field mt-1 font-mono" value={fn} onChange={(e) => setFn(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-lab-muted">{tr.derivative}</label>
            <input className="input-field mt-1 font-mono" value={deriv} onChange={(e) => setDeriv(e.target.value)} disabled={numDeriv} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={numDeriv} onChange={(e) => setNumDeriv(e.target.checked)} />
            {tr.numericalDerivative}
          </label>
          <div>
            <label className="text-xs text-lab-muted">{tr.initialX}</label>
            <input type="number" className="input-field mt-1" value={x0} onChange={(e) => setX0(+e.target.value)} step="any" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-lab-muted">{tr.tolerance}</label>
              <input type="number" className="input-field mt-1" value={tol} onChange={(e) => setTol(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-lab-muted">{tr.maxIterations}</label>
              <input type="number" className="input-field mt-1" value={maxIt} onChange={(e) => setMaxIt(+e.target.value)} />
            </div>
          </div>
        </div>
      }
      chart={
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase text-lab-muted">{tr.interactivePlot}</h3>
          {plot ? (
            <>
              <PlotlyChart data={[...plot.data, ...(animMarker ? [animMarker] : [])]} layout={plot.layout} />
              {data && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-lab-muted">Animate iteration:</span>
                  <input
                    type="range"
                    min={0}
                    max={((data.plotData as { animationPath?: unknown[] }).animationPath?.length || 1) - 1}
                    value={animStep}
                    onChange={(e) => setAnimStep(+e.target.value)}
                    className="flex-1"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[380px] items-center justify-center text-sm text-lab-muted">—</div>
          )}
        </div>
      }
      results={
        <ResultPanel data={data} error={error}>
          {data && (
            <div className="overflow-x-auto">
              <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.stepTable}</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-lab-border text-lab-muted">
                    <th className="p-1">k</th>
                    <th className="p-1">x_k</th>
                    <th className="p-1">f(x_k)</th>
                    <th className="p-1">f&apos;(x_k)</th>
                    <th className="p-1">x<sub>k+1</sub></th>
                    <th className="p-1">err</th>
                  </tr>
                </thead>
                <tbody>
                  {data.iterations.map((row) => (
                    <motion.tr
                      key={String(row.k)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-lab-border/50 font-mono"
                    >
                      <td className="p-1">{String(row.k)}</td>
                      <td className="p-1">{(row.x_k as number).toPrecision(6)}</td>
                      <td className="p-1">{(row.f_x_k as number).toPrecision(6)}</td>
                      <td className="p-1">{(row.f_prime_x_k as number).toPrecision(6)}</td>
                      <td className="p-1">{(row.x_next as number).toPrecision(6)}</td>
                      <td className="p-1">{(row.error as number).toExponential(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ResultPanel>
      }
    />
  );
}

export default function NewtonPage() {
  return (
    <Suspense>
      <NewtonLab />
    </Suspense>
  );
}
