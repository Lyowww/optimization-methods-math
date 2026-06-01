"use client";

import { useApp } from "@/context/AppProviders";

export function Footer() {
  const { tr } = useApp();

  return (
    <footer className="border-t border-lab-border/60 bg-lab-surface/40 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-1 text-center text-xs text-lab-muted md:text-sm">
        <p className="font-medium text-lab-fg/80">{tr.creatorName}</p>
        <p className="max-w-3xl mx-auto leading-relaxed">{tr.projectCredit}</p>
      </div>
    </footer>
  );
}
