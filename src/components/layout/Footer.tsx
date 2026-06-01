"use client";

import { useApp } from "@/context/AppProviders";

export function Footer() {
  const { tr } = useApp();

  return (
    <footer className="mt-auto border-t border-lab-border/60 bg-lab-card/50 px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-2 text-center">
        <p className="text-sm font-semibold text-lab-text">{tr.creatorName}</p>
        <p className="text-xs leading-relaxed text-lab-muted sm:text-sm">{tr.projectCredit}</p>
      </div>
    </footer>
  );
}
