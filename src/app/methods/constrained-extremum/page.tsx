"use client";

import { useCallback, useMemo, useState } from "react";
import { useApp } from "@/context/AppProviders";
import { api, type ApiResponse } from "@/lib/api";
import { EXAMPLES } from "@/lib/examples";
import { METHODS } from "@/lib/methods";
import { constrainedExtremumPlot } from "@/lib/plots";
import { exportElementToPdf, downloadBase64Png, copyText } from "@/lib/export";
import { MethodLabLayout } from "@/components/lab/MethodLabLayout";
import { ActionBar } from "@/components/lab/ActionBar";
import { ChartPlaceholder } from "@/components/lab/ChartPlaceholder";
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
            className="input-field flex-1 font-mono text-sm"
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 text-red-400 transition hover:bg-red-500/10"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary w-full text-sm" onClick={() => onChange([...items, ""])}>
        + {label}
      </button>
    </div>
  );
}

const moduleMeta = METHODS.find((m) => m.id === "constrained-extremum")!;

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

  const loadExample = () => {
    setObjective(ex.objective);
    setEqualities(ex.equalities);
    setInequalities(ex.inequalities);
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
          onExportPdf={() => exportElementToPdf("lab-export-root", "constrained-extremum.pdf")}
          onDownloadPng={() =>
            data?.matplotlibImageBase64 &&
            downloadBase64Png(data.matplotlibImageBase64, "constrained-extremum.png")
          }
        />
      }
      input={
        <div className="mx-auto max-w-lg space-y-5">
          <button type="button" className="btn-secondary w-full" onClick={loadExample}>
            {tr.example}
          </button>
          <div>
            <label className="label-field">{tr.objective}</label>
            <input
              className="input-field font-mono text-sm"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>
          <ConstraintList label={tr.equalities} items={equalities} onChange={setEqualities} />
          <ConstraintList label={tr.inequalities} items={inequalities} onChange={setInequalities} />
        </div>
      }
      chart={
        plot ? <PlotlyChart data={plot.data} layout={plot.layout} /> : <ChartPlaceholder />
      }
    />
  );
}
