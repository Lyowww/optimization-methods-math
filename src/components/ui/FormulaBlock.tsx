"use client";

import { Component, type ReactNode } from "react";
import { BlockMath, InlineMath } from "react-katex";

class KatexErrorBoundary extends Component<
  { children: ReactNode; fallback: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-lab-muted">
          {this.props.fallback}
        </pre>
      );
    }
    return this.props.children;
  }
}

export function FormulaBlock({ tex, block = true }: { tex: string; block?: boolean }) {
  const cleaned = tex.replace(/\\\\/g, "\\");
  const inner = block ? <BlockMath math={cleaned} /> : <InlineMath math={cleaned} />;

  return (
    <div className="katex-block text-lab-text">
      <KatexErrorBoundary fallback={tex}>{inner}</KatexErrorBoundary>
    </div>
  );
}
