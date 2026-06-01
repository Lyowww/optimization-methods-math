"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileJson,
  FunctionSquare,
  ImageIcon,
  ListOrdered,
} from "lucide-react";
import type { ApiResponse } from "@/lib/api";
import { getResultHighlights } from "@/lib/formatResult";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { StepsPanel } from "@/components/lab/StepsPanel";
import { Tabs } from "@/components/ui/Tabs";
import { useApp } from "@/context/AppProviders";

interface ResultPanelProps {
  data: ApiResponse | null;
  error: string | null;
  children?: React.ReactNode;
}

export function ResultPanel({ data, error, children }: ResultPanelProps) {
  const { tr } = useApp();

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <AlertCircle className="mt-0.5 shrink-0 text-red-400" size={20} />
        <div>
          <p className="text-sm font-semibold text-red-300">{tr.validationError}</p>
          <p className="mt-1 text-sm text-red-400/90">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-lab-border py-16 text-center">
        <FunctionSquare className="mb-3 text-lab-muted opacity-40" size={40} />
        <p className="text-sm font-medium text-lab-muted">{tr.emptySolution}</p>
        <p className="mt-1 max-w-xs text-xs text-lab-muted/80">{tr.emptySolutionHint}</p>
      </div>
    );
  }

  const highlights = getResultHighlights(data);

  const summaryTab = (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-3 rounded-xl border p-4 ${
          data.converged
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-amber-500/30 bg-amber-500/10"
        }`}
      >
        {data.converged ? (
          <CheckCircle2 className="shrink-0 text-emerald-400" size={24} />
        ) : (
          <AlertCircle className="shrink-0 text-amber-400" size={24} />
        )}
        <div>
          <p className="font-semibold text-lab-text">
            {data.converged ? tr.converged : tr.notConverged}
          </p>
          <p className="text-xs text-lab-muted">{tr.resultSummary}</p>
        </div>
      </div>

      {highlights.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.label}
              className={`rounded-xl border p-4 ${
                h.accent
                  ? "border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/5"
                  : "border-lab-border bg-slate-900/10 dark:bg-slate-950/20"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-lab-muted">
                {h.label}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-cyan-600 dark:text-cyan-300">
                {h.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {children}

      <details className="group rounded-xl border border-lab-border bg-slate-900/10 dark:bg-slate-950/20">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-lab-muted">
          <FileJson size={14} />
          {tr.rawData}
        </summary>
        <pre className="max-h-48 overflow-auto border-t border-lab-border p-4 font-mono text-[11px] leading-relaxed text-lab-muted">
          {JSON.stringify(data.result, null, 2)}
        </pre>
      </details>
    </div>
  );

  const formulasTab = (
    <div className="space-y-3">
      {Object.entries(data.formulas).length === 0 ? (
        <p className="text-sm text-lab-muted">—</p>
      ) : (
        Object.entries(data.formulas).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-lab-border bg-slate-900/10 p-3 dark:bg-slate-950/20">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-500/80">
              {k}
            </p>
            <FormulaBlock tex={v} />
          </div>
        ))
      )}
    </div>
  );

  const stepsTab = <StepsPanel steps={data.iterations} />;

  const plotTab = data.matplotlibImageBase64 ? (
    <div className="overflow-hidden rounded-xl border border-lab-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${data.matplotlibImageBase64}`}
        alt={tr.staticPlot}
        className="w-full"
      />
    </div>
  ) : (
    <p className="py-8 text-center text-sm text-lab-muted">{tr.noStaticPlot}</p>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Tabs
        variant="underline"
        tabs={[
          {
            id: "summary",
            label: tr.tabSummary,
            icon: <CheckCircle2 size={15} />,
            content: summaryTab,
          },
          {
            id: "formulas",
            label: tr.tabFormulas,
            icon: <FunctionSquare size={15} />,
            content: formulasTab,
          },
          {
            id: "steps",
            label: tr.tabSteps,
            icon: <ListOrdered size={15} />,
            content: stepsTab,
          },
          {
            id: "static",
            label: tr.tabStatic,
            icon: <ImageIcon size={15} />,
            content: plotTab,
          },
        ]}
      />
    </motion.div>
  );
}
