"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useApp } from "@/context/AppProviders";
import { api } from "@/lib/api";
import type { MethodId } from "@/lib/methods";

export default function AnalyzePage() {
  const { tr } = useApp();
  const router = useRouter();
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<Record<string, unknown> | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.analyze(text);
      setMethod(res.method);
      setParsed(res.parsed);
      if (!res.method) setError("Could not detect method. Try mentioning Jacobi, Newton, LU, etc.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const goToMethod = () => {
    if (!method) return;
    const params = new URLSearchParams();
    params.set("auto", "1");
    params.set("data", JSON.stringify(parsed));
    router.push(`/methods/${method}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">{tr.analyze}</h1>
        <p className="mt-2 text-sm text-lab-muted">
          Describe your problem in natural language (English). The parser will detect the method and parameters.
        </p>
      </motion.div>

      <div className="glass-card space-y-4 p-6">
        <textarea
          className="input-field min-h-[140px] font-mono text-sm"
          placeholder={tr.problemPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="button" className="btn-primary" onClick={analyze} disabled={loading}>
            <Sparkles size={16} />
            {loading ? tr.analyzing : tr.parseAndRun}
          </button>
          {method && parsed && (
            <button type="button" className="btn-secondary" onClick={goToMethod}>
              Open {method} →
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {parsed && (
          <div className="rounded-lg bg-slate-900/30 p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-lab-muted">
              Detected: {method || "unknown"}
            </p>
            <pre className="overflow-x-auto text-xs">{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
