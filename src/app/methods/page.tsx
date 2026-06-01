"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppProviders";
import { METHODS } from "@/lib/methods";

export default function MethodsPage() {
  const { tr } = useApp();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{tr.selectMethod}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-lab-muted sm:text-base">{tr.tagline}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {METHODS.map((m, i) => {
          const meta = tr.methodsList[m.id];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={m.href}
                className="glass-card group flex items-start gap-4 overflow-hidden p-5 transition hover:border-cyan-500/30 hover:shadow-glass-lg sm:p-6"
              >
                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${m.color}`} />
                <span
                  className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg ${m.color}`}
                >
                  {m.icon}
                </span>
                <div className="relative min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{meta.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-lab-muted">{meta.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 opacity-0 transition group-hover:opacity-100 dark:text-cyan-400">
                    Open lab <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
