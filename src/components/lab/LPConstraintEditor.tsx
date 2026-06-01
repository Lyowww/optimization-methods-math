"use client";

import type { LPConstraint } from "@/lib/api";
import { useApp } from "@/context/AppProviders";

interface LPConstraintEditorProps {
  sense: "max" | "min";
  onSenseChange: (s: "max" | "min") => void;
  objective: number[];
  onObjectiveChange: (o: number[]) => void;
  constraints: LPConstraint[];
  onConstraintsChange: (c: LPConstraint[]) => void;
}

export function LPConstraintEditor({
  sense,
  onSenseChange,
  objective,
  onObjectiveChange,
  constraints,
  onConstraintsChange,
}: LPConstraintEditorProps) {
  const { tr } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <label className="label-field">{tr.objectiveSense}</label>
        <select
          className="input-field w-full"
          value={sense}
          onChange={(e) => onSenseChange(e.target.value as "max" | "min")}
        >
          <option value="max">{tr.maximize}</option>
          <option value="min">{tr.minimize}</option>
        </select>
      </div>
      <div>
        <label className="label-field">{tr.objectiveCoeffs}</label>
        <div className="flex gap-2">
          <input
            type="number"
            className="input-field font-mono text-xs"
            value={objective[0]}
            onChange={(e) => onObjectiveChange([+e.target.value, objective[1]])}
          />
          <input
            type="number"
            className="input-field font-mono text-xs"
            value={objective[1]}
            onChange={(e) => onObjectiveChange([objective[0], +e.target.value])}
          />
        </div>
      </div>
      <div>
        <label className="label-field">{tr.constraints}</label>
        {constraints.map((c, i) => (
          <div key={i} className="mb-2 flex flex-wrap items-center gap-1 text-xs">
            <input
              type="number"
              className="input-field w-14 font-mono"
              value={c.coeffs[0]}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = { ...c, coeffs: [+e.target.value, c.coeffs[1]] };
                onConstraintsChange(next);
              }}
            />
            <span>x₁ +</span>
            <input
              type="number"
              className="input-field w-14 font-mono"
              value={c.coeffs[1]}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = { ...c, coeffs: [c.coeffs[0], +e.target.value] };
                onConstraintsChange(next);
              }}
            />
            <span>x₂</span>
            <select
              className="input-field w-14"
              value={c.op}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = { ...c, op: e.target.value as LPConstraint["op"] };
                onConstraintsChange(next);
              }}
            >
              <option value="<=">≤</option>
              <option value=">=">≥</option>
              <option value="=">=</option>
            </select>
            <input
              type="number"
              className="input-field w-16 font-mono"
              value={c.rhs}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = { ...c, rhs: +e.target.value };
                onConstraintsChange(next);
              }}
            />
            <button
              type="button"
              className="text-red-400"
              onClick={() => onConstraintsChange(constraints.filter((_, j) => j !== i))}
              disabled={constraints.length <= 2}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary w-full text-xs"
          onClick={() =>
            onConstraintsChange([...constraints, { coeffs: [1, 1], rhs: 10, op: "<=" }])
          }
        >
          {tr.addConstraint}
        </button>
      </div>
    </div>
  );
}
