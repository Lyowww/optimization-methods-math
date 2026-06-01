"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, PenLine, Sparkles } from "lucide-react";
import type { ApiResponse } from "@/lib/api";
import { Tabs } from "@/components/ui/Tabs";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { useApp } from "@/context/AppProviders";
import { LabTabProvider } from "@/context/LabTabContext";

interface MethodLabLayoutProps {
  title: string;
  description: string;
  moduleIcon: string;
  moduleColor: string;
  input: ReactNode;
  chart: ReactNode;
  chartToolbar?: ReactNode;
  data: ApiResponse | null;
  error: string | null;
  resultExtra?: ReactNode;
  actions: ReactNode;
}

export function MethodLabLayout({
  title,
  description,
  moduleIcon,
  moduleColor,
  input,
  chart,
  chartToolbar,
  data,
  error,
  resultExtra,
  actions,
}: MethodLabLayoutProps) {
  const { tr } = useApp();
  const [activeTab, setActiveTab] = useState("input");

  const graphPanel = (
    <div className="px-1 pb-2 sm:px-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-lab-border/60 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-lab-muted">
          {tr.interactivePlot}
        </p>
        <p className="text-[10px] text-lab-muted">{tr.plotHint}</p>
      </div>
      {chartToolbar}
      <div className="plot-container">{chart}</div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1680px] space-y-4 sm:space-y-6">
      <header className="glass-card overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r ${moduleColor}`} />
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg ${moduleColor}`}
            >
              {moduleIcon}
            </div>
            <div className="min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-xl font-bold leading-tight sm:text-2xl md:text-3xl"
              >
                {title}
              </motion.h1>
              <p className="mt-1.5 text-sm leading-relaxed text-lab-muted">{description}</p>
            </div>
          </div>
          <div className="shrink-0">{actions}</div>
        </div>
      </header>

      <div id="lab-export-root" className="glass-card p-3 sm:p-4">
        <LabTabProvider activeTab={activeTab}>
        <Tabs
          variant="pill"
          defaultTab="input"
          keepMounted
          onChange={setActiveTab}
          tabs={[
            {
              id: "input",
              label: tr.tabInput,
              icon: <PenLine size={16} />,
              content: (
                <div className="px-1 pb-2 sm:px-2">
                  <p className="mb-4 text-xs text-lab-muted">{tr.tabInputHint}</p>
                  {input}
                </div>
              ),
            },
            {
              id: "graph",
              label: tr.tabGraph,
              icon: <LineChart size={16} />,
              content: graphPanel,
            },
            {
              id: "solution",
              label: tr.tabSolution,
              icon: <Sparkles size={16} />,
              content: (
                <div className="px-1 pb-2 sm:px-2">
                  <ResultPanel data={data} error={error}>
                    {resultExtra}
                  </ResultPanel>
                </div>
              ),
            },
          ]}
        />
        </LabTabProvider>
      </div>
    </div>
  );
}
