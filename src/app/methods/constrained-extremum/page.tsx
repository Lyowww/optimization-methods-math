"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { constrainedExtremumPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { PlotlyChart } from "@/components/charts/PlotlyChart";

function ConstraintList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <input
            className="input-field flex-1 font-mono text-xs"
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            className="text-red-400"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary w-full text-xs" onClick={() => onChange([...items, ""])}>
        +
      </button>
    </div>
  );
}

export default function ConstrainedExtremumPage() {
  const { tr } = useApp();
  const meta = tr.methodsList["constrained-extremum"];
  const ex = EXAMPLES["constrained-extremum"];

  const [objective, setObjective] = useState(ex.objective);
  const [equalities, setEqualities] = useState(ex.equalities);
  const [inequalities, setInequalities] = useState(ex.inequalities);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.constrainedExtremum({
        objective,
        equalities: equalities.filter(Boolean),
        inequalities: inequalities.filter(Boolean),
      });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [objective, equalities, inequalities]);

  const plot = useMemo(
    () => (data?.plotData ? constrainedExtremumPlot(data.plotData) : null),
    [data]
  );

  return (
    <MethodLabLayout
      title={meta.title}
      description={meta.desc}
      actions={
        <ActionBar
          loading={loading}
          onRun={run}
          onReset={() => {
            setObjective(ex.objective);
            setEqualities(ex.equalities);
            setInequalities(ex.inequalities);
            setData(null);
          }}
          onCopy={() => data && copyText(JSON.stringify(data, null, 2))}
          onExportPdf={() => exportElementToPdf("lab-export-root", "constrained-extremum.pdf")}
          onDownloadPng={() =>
            data?.matplotlibImageBase64 &&
            downloadBase64Png(data.matplotlibImageBase64, "constrained-extremum.png")
          }
        />
      }
      input={
        <div className="space-y-4">
          <button
            type="button"
            className="btn-secondary w-full text-xs"
            onClick={() => {
              setObjective(ex.objective);
              setEqualities(ex.equalities);
              setInequalities(ex.inequalities);
            }}
          >
            {tr.example}
          </button>
          <div>
            <label className="label-field">{tr.objective}</label>
            <input className="input-field w-full font-mono text-xs" value={objective} onChange={(e) => setObjective(e.target.value)} />
          </div>
          <ConstraintList label={tr.equalities} items={equalities} onChange={setEqualities} />
          <ConstraintList label={tr.inequalities} items={inequalities} onChange={setInequalities} />
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
