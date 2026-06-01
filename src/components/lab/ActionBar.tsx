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
  return (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" className="btn-primary" onClick={onRun} disabled={loading}>
        <Play size={16} />
        {loading ? tr.loading : tr.run}
      </button>
      <button type="button" className="btn-secondary" onClick={onReset}>
        <RotateCcw size={16} />
        {tr.reset}
      </button>
      <button type="button" className="btn-secondary" onClick={onCopy}>
        <Copy size={16} />
        {tr.copy}
      </button>
      <button type="button" className="btn-secondary" onClick={onExportPdf}>
        <FileDown size={16} />
        {tr.exportPdf}
      </button>
      {onDownloadPng && (
        <button type="button" className="btn-secondary" onClick={onDownloadPng}>
          <Download size={16} />
          {tr.downloadPng}
        </button>
      )}
    </div>
  );
}
