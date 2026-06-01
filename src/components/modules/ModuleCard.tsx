"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MethodMeta } from "@/lib/methods";

interface ModuleCardProps {
  method: MethodMeta;
  title: string;
  description: string;
  openLabel?: string;
  variant?: "grid" | "list";
}

export function ModuleCard({
  method,
  title,
  description,
  openLabel = "Open lab",
  variant = "grid",
}: ModuleCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={method.href}
        className="glass-card group relative flex flex-col overflow-hidden transition hover:border-cyan-500/35 hover:shadow-glass-lg"
      >
        <div className={`h-1 shrink-0 bg-gradient-to-r ${method.color}`} />
        <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white shadow-md sm:h-14 sm:w-14 sm:text-2xl ${method.color}`}
          >
            {method.icon}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="text-base font-semibold leading-snug text-lab-text sm:text-lg">{title}</h2>
            <div className="mt-3 rounded-lg border border-lab-border/80 bg-slate-500/5 px-3 py-2.5 dark:bg-slate-950/30">
              <p className="text-xs leading-[1.65] text-lab-muted sm:text-sm">{description}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 transition group-hover:gap-2 dark:text-cyan-400">
              {openLabel} <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={method.href}
      className="glass-card group flex h-full flex-col overflow-hidden transition hover:border-cyan-500/35 hover:shadow-glass-lg"
    >
      <div className={`h-1 shrink-0 bg-gradient-to-r ${method.color}`} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg text-white shadow-md ${method.color}`}
          >
            {method.icon}
          </span>
          <h3 className="min-w-0 flex-1 pt-0.5 text-base font-semibold leading-snug text-lab-text">
            {title}
          </h3>
        </div>
        <div className="mt-4 flex-1 rounded-lg border border-lab-border/80 bg-slate-500/5 px-3 py-2.5 dark:bg-slate-950/30">
          <p className="text-xs leading-[1.65] text-lab-muted sm:text-sm">{description}</p>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 opacity-80 transition group-hover:gap-2 group-hover:opacity-100 dark:text-cyan-400">
          {openLabel} <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
