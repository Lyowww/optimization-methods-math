"use client";

import { useCallback, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { useQueryAutoRun } from "@/hooks/useQueryAutoRun";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { MatrixInput } from "@/components/lab/MatrixInput";
import { VectorInput } from "@/components/lab/VectorInput";
import { FormulaBlock } from "@/components/ui/FormulaBlock";

function LULab() {
  const { tr } = useApp();
  const meta = tr.methodsList.lu;
  const ex = EXAMPLES.lu as { A: number[][]; b: number[] };

  const [A, setA] = useState(ex.A);
  const [b, setB] = useState(ex.b);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.lu({ A, b });
      setData(res);
      setStep(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [A, b]);

  useQueryAutoRun((parsed) => {
    if (parsed.A) setA(parsed.A as number[][]);
    if (parsed.b) setB(parsed.b as number[]);
    setTimeout(() => run(), 100);
  });

  const L = data?.result ? (data.result.L as number[][]) : null;
  const U = data?.result ? (data.result.U as number[][]) : null;

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => { setA(ex.A); setB(ex.b); setData(null); }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "lu.pdf")}
          onDownloadPng={() => data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "lu.png")}
        />
      }
      input={
        <div className="space-y-4">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => { setA(ex.A); setB(ex.b); }}>
            {tr.example}
          </button>
          <MatrixInput label={tr.matrixA} value={A} onChange={setA} />
          <VectorInput label={tr.vectorB} value={b} onChange={setB} />
        </div>
      }
      chart={
        <div className="space-y-4">
          {L && U ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid gap-4 md:grid-cols-2"
            >
              <MatrixDisplay title="L" matrix={L} />
              <MatrixDisplay title="U" matrix={U} />
            </motion.div>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-lab-muted">
              {tr.interactivePlot} — run to see L, U
            </div>
          )}
          {data && (
            <>
              <input
                type="range"
                min={0}
                max={Math.max(0, data.iterations.length - 1)}
                value={step}
                onChange={(e) => setStep(+e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-lab-muted">Step {step + 1} / {data.iterations.length}</p>
            </>
          )}
        </div>
      }
      results={
        <ResultPanel data={data} error={error}>
          {data && (
            <>
              <FormulaBlock tex="PA = LU" />
              <FormulaBlock tex="Ly = Pb,\quad Ux = y" />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function MatrixDisplay({ title, matrix }: { title: string; matrix: number[][] }) {
  return (
    <div className="rounded-xl bg-slate-900/30 p-3">
      <h4 className="mb-2 text-center text-sm font-semibold">{title}</h4>
      <table className="mx-auto font-mono text-xs">
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-lab-border/30 px-2 py-1 text-center">
                  {cell.toPrecision(4)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LUPage() {
  return (
    <Suspense>
      <LULab />
    </Suspense>
  );
}
