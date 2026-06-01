"use client";

import { LineChart } from "lucide-react";
import { useApp } from "@/context/AppProviders";

export function ChartPlaceholder() {
  const { tr } = useApp();
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-lab-border bg-slate-900/5 dark:bg-slate-950/30">
        <LineChart className="text-lab-muted/40" size={32} />
      </div>
      <p className="text-sm font-medium text-lab-muted">{tr.emptySolution}</p>
      <p className="max-w-xs text-xs text-lab-muted/70">{tr.plotHint}</p>
    </div>
  );
}
