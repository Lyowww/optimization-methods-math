"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { calculusPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";

export default function CalculusOfVariationsPage() {
  const { tr } = useApp();
  const meta = tr.methodsList["calculus-of-variations"];
  const ex = EXAMPLES["calculus-of-variations"];

  const [integrand, setIntegrand] = useState(ex.integrand);
  const [a, setA] = useState(ex.a);
  const [b, setB] = useState(ex.b);
  const [yA, setYA] = useState(ex.y_a);
  const [yB, setYB] = useState(ex.y_b);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.calculusOfVariations({
        integrand,
        a,
        b,
        y_a: yA,
        y_b: yB,
      });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [integrand, a, b, yA, yB]);

  const plot = useMemo(() => (data?.plotData ? calculusPlot(data.plotData) : null), [data]);

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setIntegrand(ex.integrand);
            setA(ex.a);
            setB(ex.b);
            setYA(ex.y_a);
            setYB(ex.y_b);
            setData(null);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "calculus-of-variations.pdf")}
          onDownloadPng={() =>
            data?.matplotlibImageBase64 &&
            downloadBase64Png(data.matplotlibImageBase64, "calculus-of-variations.png")
          }
        />
      }
      input={
        <div className="space-y-4">
          <button
            type="button"
            className="btn-secondary w-full text-xs"
            onClick={() => {
              setIntegrand(ex.integrand);
              setA(ex.a);
              setB(ex.b);
              setYA(ex.y_a);
              setYB(ex.y_b);
            }}
          >
            {tr.example}
          </button>
          <div>
            <label className="label-field">{tr.integrand}</label>
            <input
              className="input-field w-full font-mono text-xs"
              value={integrand}
              onChange={(e) => setIntegrand(e.target.value)}
              placeholder="yp**2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-field">{tr.intervalA}</label>
              <input type="number" className="input-field w-full font-mono text-xs" value={a} onChange={(e) => setA(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.intervalB}</label>
              <input type="number" className="input-field w-full font-mono text-xs" value={b} onChange={(e) => setB(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.boundaryYa}</label>
              <input type="number" className="input-field w-full font-mono text-xs" value={yA} onChange={(e) => setYA(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.boundaryYb}</label>
              <input type="number" className="input-field w-full font-mono text-xs" value={yB} onChange={(e) => setYB(+e.target.value)} />
            </div>
          </div>
        </div>
      }
      chart={
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.interactivePlot}</h3>
          {plot ? (
            <PlotlyChart data={plot.data} layout={plot.layout} config={{ scrollZoom: true }} />
          ) : (
            <div className="flex h-[380px] items-center justify-center text-sm text-lab-muted">—</div>
          )}
        </div>
      }
      results={<ResultPanel data={data} error={error} />}
    />
  );
}
