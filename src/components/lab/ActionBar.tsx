"use client";

import { Copy, Download, FileDown, Play, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppProviders";

interface ActionBarProps {
  onRun: () => void;
  onReset: () => void;
  onCopy: () => void;
  onExportPdf: () => void;
  onDownloadPng?: () => void;
  loading?: boolean;
}

export function ActionBar({
  onRun,
  onReset,
  onCopy,
  onExportPdf,
  onDownloadPng,
  loading,
}: ActionBarProps) {
  const { tr } = useApp();

  const btnClass =
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-lab-border bg-lab-card/80 px-3 py-2 text-xs font-medium transition hover:border-cyan-500/40 hover:bg-cyan-500/5 sm:px-3.5 sm:text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-primary text-xs sm:text-sm" onClick={onRun} disabled={loading}>
        <Play size={16} className={loading ? "animate-pulse" : ""} />
        <span>{loading ? tr.loading : tr.run}</span>
      </button>
      <button type="button" className={btnClass} onClick={onReset}>
        <RotateCcw size={15} />
        <span className="hidden sm:inline">{tr.reset}</span>
      </button>
      <button type="button" className={btnClass} onClick={onCopy}>
        <Copy size={15} />
        <span className="hidden sm:inline">{tr.copy}</span>
      </button>
      <button type="button" className={btnClass} onClick={onExportPdf}>
        <FileDown size={15} />
        <span className="hidden sm:inline">{tr.exportPdf}</span>
      </button>
      {onDownloadPng && (
        <button type="button" className={btnClass} onClick={onDownloadPng}>
          <Download size={15} />
          <span className="hidden sm:inline">{tr.downloadPng}</span>
        </button>
      )}
    </div>
  );
}
