import type { ApiResponse } from "./api";

export interface ResultHighlight {
  label: string;
  value: string;
  accent?: boolean;
}

export function getResultHighlights(data: ApiResponse): ResultHighlight[] {
  const r = data.result;
  const items: ResultHighlight[] = [];

  switch (data.method) {
    case "constrained-extremum": {
      const opt = r.optimum as { x1?: number; x2?: number; f?: number } | undefined;
      if (opt) {
        items.push({ label: "x₁*", value: formatNum(opt.x1), accent: true });
        items.push({ label: "x₂*", value: formatNum(opt.x2), accent: true });
        items.push({ label: "f*", value: formatNum(opt.f), accent: true });
      }
      break;
    }
    case "linear-programming":
    case "graphical-lp": {
      const x = r.x as number[] | undefined;
      const z = r.objectiveValue as number | undefined;
      if (x) {
        items.push({ label: "x₁*", value: formatNum(x[0]), accent: true });
        items.push({ label: "x₂*", value: formatNum(x[1]), accent: true });
      }
      if (z != null) items.push({ label: "z*", value: formatNum(z), accent: true });
      break;
    }
    case "calculus-of-variations": {
      const J = r.functionalValue as number | undefined;
      const ext = r.extremal as string | undefined;
      if (ext) items.push({ label: "y(x)", value: ext.slice(0, 48) + (ext.length > 48 ? "…" : "") });
      if (J != null) items.push({ label: "J[y*]", value: formatNum(J), accent: true });
      break;
    }
    default:
      break;
  }

  return items;
}

function formatNum(n: unknown): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-4 || Math.abs(n) >= 1e6) return n.toExponential(4);
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}
