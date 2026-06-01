"use client";

interface VectorInputProps {
  label: string;
  value: number[];
  onChange: (v: number[]) => void;
  size?: number;
}

export function VectorInput({ label, value, onChange, size = 3 }: VectorInputProps) {
  const vec = [...value];
  while (vec.length < size) vec.push(0);

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase text-lab-muted">{label}</label>
      <div className="flex flex-wrap gap-1">
        {vec.slice(0, size).map((cell, i) => (
          <input
            key={i}
            type="number"
            step="any"
            className="input-field w-16 text-center font-mono text-xs"
            value={cell}
            onChange={(e) => {
              const next = [...vec];
              next[i] = parseFloat(e.target.value) || 0;
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}
