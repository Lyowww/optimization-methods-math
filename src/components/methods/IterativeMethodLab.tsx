"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { buildPlotFromResponse, comparePlotData } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { useQueryAutoRun } from "@/hooks/useQueryAutoRun";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import { MatrixInput } from "@/components/lab/MatrixInput";
import { VectorInput } from "@/components/lab/VectorInput";
import type { MethodId } from "@/lib/methods";

interface IterativeMethodLabProps {
  methodId: "jacobi" | "gauss-seidel";
}

function Lab({ methodId }: IterativeMethodLabProps) {
  const { tr } = useApp();
  const meta = tr.methodsList[methodId];
  const ex = EXAMPLES[methodId] as {
    A: number[][];
    b: number[];
    x0: number[];
    tolerance: number;
    max_iterations: number;
  };

  const [A, setA] = useState(ex.A);
  const [b, setB] = useState(ex.b);
  const [x0, setX0] = useState(ex.x0);
  const [tol, setTol] = useState(ex.tolerance);
  const [maxIt, setMaxIt] = useState(ex.max_iterations);
  const [compare, setCompare] = useState(methodId === "gauss-seidel");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [compareData, setCompareData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = { A, b, x0, tolerance: tol, max_iterations: maxIt };
      if (compare && methodId === "gauss-seidel") {
        const res = await api.compare(body);
        setCompareData(res);
        setData(res.gauss_seidel as ApiResponse);
      } else {
        const res =
          methodId === "jacobi" ? await api.jacobi(body) : await api.gaussSeidel(body);
        setData(res);
        setCompareData(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [A, b, x0, tol, maxIt, compare, methodId]);

  const applyAuto = useCallback(
    (parsed: Record<string, unknown>) => {
      if (parsed.A) setA(parsed.A as number[][]);
      if (parsed.b) setB(parsed.b as number[]);
      if (parsed.x0) setX0(parsed.x0 as number[]);
      if (parsed.tolerance != null) setTol(Number(parsed.tolerance));
      if (parsed.max_iterations != null) setMaxIt(Number(parsed.max_iterations));
      setTimeout(() => run(), 100);
    },
    [run]
  );

  useQueryAutoRun(applyAuto);

  const plot = useMemo(() => {
    if (compareData?.plotData) return comparePlotData(compareData.plotData as Record<string, unknown>);
    return data ? buildPlotFromResponse(data) : null;
  }, [data, compareData]);

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setA(ex.A);
            setB(ex.b);
            setX0(ex.x0);
            setData(null);
            setCompareData(null);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", `${methodId}.pdf`)}
          onDownloadPng={() => data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, `${methodId}.png`)}
        />
      }
      input={
        <div className="space-y-4">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => { setA(ex.A); setB(ex.b); setX0(ex.x0); }}>
            {tr.example}
          </button>
          <MatrixInput label={tr.matrixA} value={A} onChange={setA} />
          <VectorInput label={tr.vectorB} value={b} onChange={setB} />
          <VectorInput label={tr.vectorX0} value={x0} onChange={setX0} />
          {methodId === "gauss-seidel" && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
              {tr.compareMode}
            </label>
          )}
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
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.interactivePlot}</h3>
          {compareData && "comparison" in compareData && (
            <p className="mb-2 text-sm text-cyan-400">
              Faster: {(compareData.comparison as { faster: string }).faster} (Jacobi:{" "}
              {(compareData.comparison as { jacobi_iters: number }).jacobi_iters} iters, GS:{" "}
              {(compareData.comparison as { gs_iters: number }).gs_iters})
            </p>
          )}
          {plot ? <PlotlyChart data={plot.data} layout={plot.layout} /> : <div className="flex h-[380px] items-center justify-center text-sm text-lab-muted">—</div>}
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
                    <th className="p-1">x</th>
                    <th className="p-1">||r||</th>
                    <th className="p-1">err</th>
                  </tr>
                </thead>
                <tbody>
                  {data.iterations.map((row) => (
                    <motion.tr key={String(row.k)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-lab-border/50 font-mono">
                      <td className="p-1">{String(row.k)}</td>
                      <td className="p-1">{(row.x as number[]).map((v) => v.toFixed(4)).join(", ")}</td>
                      <td className="p-1">{(row.residual_norm as number).toExponential(2)}</td>
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

export function IterativeMethodLab(props: IterativeMethodLabProps) {
  return (
    <Suspense>
      <Lab {...props} />
    </Suspense>
  );
}
