"use client";

import { ReactNode, useId, useState } from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: "pill" | "underline";
  className?: string;
  onChange?: (id: string) => void;
}

export function Tabs({ tabs, defaultTab, variant = "pill", className = "", onChange }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const baseId = useId();

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Sections"
        className={
          variant === "pill"
            ? "flex gap-1 overflow-x-auto rounded-xl border border-lab-border bg-slate-900/10 p-1 scrollbar-none dark:bg-slate-950/30"
            : "flex gap-0 overflow-x-auto border-b border-lab-border scrollbar-none"
        }
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              onClick={() => select(tab.id)}
              className={
                variant === "pill"
                  ? `relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "text-white shadow-md"
                        : "text-lab-muted hover:bg-slate-500/10 hover:text-lab-text"
                    }`
                  : `relative flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "border-cyan-500 text-cyan-600 dark:text-cyan-300"
                        : "border-transparent text-lab-muted hover:text-lab-text"
                    }`
              }
            >
              {variant === "pill" && isActive && (
                <motion.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${current?.id}`}
        aria-labelledby={`${baseId}-tab-${current?.id}`}
        className="mt-4 focus:outline-none"
      >
        {current?.content}
      </div>
    </div>
  );
}
