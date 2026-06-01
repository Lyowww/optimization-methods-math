"use client";

interface MatrixInputProps {
  label: string;
  value: number[][];
  onChange: (v: number[][]) => void;
  rows?: number;
  cols?: number;
}

export function MatrixInput({ label, value, onChange, rows = 3, cols = 3 }: MatrixInputProps) {
  const update = (i: number, j: number, val: string) => {
    const next = value.map((row) => [...row]);
    while (next.length < rows) next.push(Array(cols).fill(0));
    while (next[i].length < cols) next[i].push(0);
    next[i][j] = parseFloat(val) || 0;
    onChange(next);
  };

  const mat =
    value.length >= rows
      ? value.slice(0, rows).map((r) => [...r.slice(0, cols), ...Array(Math.max(0, cols - r.length)).fill(0)])
      : [
          ...value,
          ...Array(rows - value.length)
            .fill(null)
            .map(() => Array(cols).fill(0)),
        ];

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase text-lab-muted">{label}</label>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {mat.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              step="any"
              className="input-field w-16 text-center font-mono text-xs"
              value={cell}
              onChange={(e) => update(i, j, e.target.value)}
            />
          ))
        )}
      </div>
    </div>
  );
}
