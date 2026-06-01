"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { METHODS } from "@/lib/methods";
import { calculusPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ChartPlaceholder } from "@/components/lab/ChartPlaceholder";
import { PlotlyChart } from "@/components/charts/PlotlyChart";

const moduleMeta = METHODS.find((m) => m.id === "calculus-of-variations")!;

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

  const loadExample = () => {
    setIntegrand(ex.integrand);
    setA(ex.a);
    setB(ex.b);
    setYA(ex.y_a);
    setYB(ex.y_b);
  };

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      moduleIcon={moduleMeta.icon}
      moduleColor={moduleMeta.color}
      data={data}
      error={error}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            loadExample();
            setData(null);
            setError(null);
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
        <div className="mx-auto max-w-lg space-y-5">
          <button type="button" className="btn-secondary w-full" onClick={loadExample}>
            {tr.example}
          </button>
          <div>
            <label className="label-field">{tr.integrand}</label>
            <input
              className="input-field font-mono text-sm"
              value={integrand}
              onChange={(e) => setIntegrand(e.target.value)}
              placeholder="yp**2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">{tr.intervalA}</label>
              <input type="number" className="input-field font-mono text-sm" value={a} onChange={(e) => setA(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.intervalB}</label>
              <input type="number" className="input-field font-mono text-sm" value={b} onChange={(e) => setB(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.boundaryYa}</label>
              <input type="number" className="input-field font-mono text-sm" value={yA} onChange={(e) => setYA(+e.target.value)} />
            </div>
            <div>
              <label className="label-field">{tr.boundaryYb}</label>
              <input type="number" className="input-field font-mono text-sm" value={yB} onChange={(e) => setYB(+e.target.value)} />
            </div>
          </div>
        </div>
      }
      chart={plot ? <PlotlyChart data={plot.data} layout={plot.layout} /> : <ChartPlaceholder />}
    />
  );
}
