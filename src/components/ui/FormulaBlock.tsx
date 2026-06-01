"use client";

import { BlockMath, InlineMath } from "react-katex";

export function FormulaBlock({ tex, block = true }: { tex: string; block?: boolean }) {
  const cleaned = tex.replace(/\\\\/g, "\\");
  return (
    <div className="katex-block text-lab-text">
      {block ? <BlockMath math={cleaned} /> : <InlineMath math={cleaned} />}
    </div>
  );
}
