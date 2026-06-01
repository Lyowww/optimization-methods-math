"use client";

import type { ApiStep } from "@/lib/api";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { useApp } from "@/context/AppProviders";

export function StepsPanel({ steps }: { steps: ApiStep[] }) {
  const { tr } = useApp();
  if (!steps.length) return null;

  return (
    <div className="mt-4 max-h-64 overflow-y-auto">
      <h3 className="mb-2 text-xs font-semibold uppercase text-lab-muted">{tr.stepTable}</h3>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.step} className="rounded-lg border border-lab-border/60 bg-slate-900/20 p-3">
            <p className="text-xs font-semibold text-cyan-500">
              {s.step}. {s.title}
            </p>
            {/[\\^_{}]/.test(s.detail) ? (
              <FormulaBlock tex={s.detail} />
            ) : (
              <p className="mt-1 text-xs text-lab-muted">{s.detail}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
