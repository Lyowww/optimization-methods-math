"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import type { ApiResponse } from "@/lib/api";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
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
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
        {tr.validationError}: {error}
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-lab-muted">{tr.run} to see {tr.result.toLowerCase()}…</p>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center gap-2">
        {data.converged ? (
          <CheckCircle className="text-emerald-400" size={20} />
        ) : (
          <XCircle className="text-amber-400" size={20} />
        )}
        <span className="text-sm font-medium">
          {data.converged ? tr.converged : tr.notConverged}
        </span>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.formulas}</h3>
        {Object.entries(data.formulas).map(([k, v]) => (
          <FormulaBlock key={k} tex={v} />
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.result}</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900/30 p-3 text-xs">
          {JSON.stringify(data.result, null, 2)}
        </pre>
      </div>

      {data.error != null && (
        <p className="text-sm">
          {tr.error}: <span className="font-mono text-cyan-400">{data.error}</span>
        </p>
      )}

      {children}

      {data.matplotlibImageBase64 && (
        <div className="mt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.staticPlot}</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${data.matplotlibImageBase64}`}
            alt="Static plot"
            className="w-full rounded-lg border border-lab-border"
          />
        </div>
      )}
    </motion.div>
  );
}
