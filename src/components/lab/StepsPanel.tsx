"use client";

import type { ApiStep } from "@/lib/api";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { useApp } from "@/context/AppProviders";

export function StepsPanel({ steps }: { steps: ApiStep[] }) {
  const { tr } = useApp();
  if (!steps.length) {
    return <p className="py-6 text-center text-sm text-lab-muted">—</p>;
  }

  return (
    <ol className="relative space-y-0">
      {steps.map((s, i) => (
        <li key={s.step} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan-500/50 to-transparent"
              aria-hidden
            />
          )}
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md">
            {s.step}
          </span>
          <div className="min-w-0 flex-1 rounded-xl border border-lab-border bg-slate-900/5 p-3 dark:bg-slate-950/30">
            <p className="text-sm font-semibold text-lab-text">{s.title}</p>
            {/[\\^_{}]/.test(s.detail) ? (
              <div className="mt-2">
                <FormulaBlock tex={s.detail} />
              </div>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-lab-muted">{s.detail}</p>
            )}
          </div>
        </li>
      ))}
      <p className="sr-only">{tr.stepTable}</p>
    </ol>
  );
}
