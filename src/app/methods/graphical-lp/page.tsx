"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse, type LPPayload } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { graphicalLpPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import { LPConstraintEditor } from "@/components/lab/LPConstraintEditor";

export default function GraphicalLpPage() {
  const { tr } = useApp();
  const meta = tr.methodsList["graphical-lp"];
  const ex = EXAMPLES["graphical-lp"];

  const [payload, setPayload] = useState<LPPayload>(ex);
  const [frame, setFrame] = useState(0);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.graphicalLp(payload);
      setData(res);
      const frames = (res.plotData.objectiveFrames as unknown[]) || [];
      setFrame(Math.max(0, frames.length - 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [payload]);

  const plot = useMemo(
    () => (data?.plotData ? graphicalLpPlot(data.plotData, frame) : null),
    [data, frame]
  );

  const maxFrame = ((data?.plotData?.objectiveFrames as unknown[]) || []).length - 1;

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
            setFrame(0);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "graphical-lp.pdf")}
          onDownloadPng={() =>
            data?.matplotlibImageBase64 && downloadBase64Png(data.matplotlibImageBase64, "graphical-lp.png")
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
          {data && maxFrame >= 0 && (
            <div className="mb-3">
              <label className="label-field">{tr.animationFrame}</label>
              <input
                type="range"
                min={0}
                max={maxFrame}
                value={frame}
                onChange={(e) => setFrame(+e.target.value)}
                className="w-full"
              />
            </div>
          )}
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
