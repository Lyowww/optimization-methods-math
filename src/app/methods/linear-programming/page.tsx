"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse, type LPPayload } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { lpPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import { LPConstraintEditor } from "@/components/lab/LPConstraintEditor";

export default function LinearProgrammingPage() {
  const { tr } = useApp();
  const meta = tr.methodsList["linear-programming"];
  const ex = EXAMPLES["linear-programming"];

  const [payload, setPayload] = useState<LPPayload>(ex);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.linearProgramming(payload);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [payload]);

  const plot = useMemo(() => (data?.plotData ? lpPlot(data.plotData) : null), [data]);

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setPayload(ex);
            setData(null);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "linear-programming.pdf")}
          onDownloadPng={() =>
            data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "lp.png")
          }
        />
      }
      input={
        <div className="space-y-3">
          <button type="button" className="btn-secondary w-full text-xs" onClick={() => setPayload(ex)}>
            {tr.example}
          </button>
          <LPConstraintEditor
            sense={payload.sense}
            onSenseChange={(sense) => setPayload({ ...payload, sense })}
            objective={payload.objective}
            onObjectiveChange={(objective) => setPayload({ ...payload, objective })}
            constraints={payload.constraints}
            onConstraintsChange={(constraints) => setPayload({ ...payload, constraints })}
          />
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
