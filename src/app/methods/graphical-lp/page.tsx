"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse, type LPPayload } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { METHODS } from "@/lib/methods";
import { graphicalLpPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ChartPlaceholder } from "@/components/lab/ChartPlaceholder";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import { LPConstraintEditor } from "@/components/lab/LPConstraintEditor";

const moduleMeta = METHODS.find((m) => m.id === "graphical-lp")!;

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

  const maxFrame = Math.max(0, ((data?.plotData?.objectiveFrames as unknown[]) || []).length - 1);

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      moduleIcon={moduleMeta.icon}
      moduleColor={moduleMeta.color}
      data={data}
      error={error}
      chartToolbar={
        data && maxFrame > 0 ? (
          <div className="mb-4 rounded-xl border border-lab-border bg-cyan-500/5 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <label className="font-semibold uppercase tracking-wider text-lab-muted">
                {tr.animationFrame}
              </label>
              <span className="font-mono text-cyan-600 dark:text-cyan-300">
                {frame + 1} / {maxFrame + 1}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={maxFrame}
              value={frame}
              onChange={(e) => setFrame(+e.target.value)}
              className="h-2 w-full cursor-pointer accent-cyan-500"
            />
          </div>
        ) : null
      }
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setPayload(ex);
            setData(null);
            setError(null);
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
        <div className="mx-auto max-w-lg space-y-4">
          <button type="button" className="btn-secondary w-full" onClick={() => setPayload(ex)}>
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
      chart={plot ? <PlotlyChart data={plot.data} layout={plot.layout} /> : <ChartPlaceholder />}
    />
  );
}
