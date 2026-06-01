"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppProviders";
import { METHODS } from "@/lib/methods";
import { ModuleCard } from "@/components/modules/ModuleCard";

export default function HomePage() {
  const { tr } = useApp();

  return (
    <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative p-6 sm:p-10 md:p-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
            <FlaskConical size={14} />
            Yerevan State University · Optimization Methods
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {tr.appName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-lab-muted md:text-lg">
            {tr.homeHero}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/methods" className="btn-primary">
              {tr.explore} <ArrowRight size={16} />
            </Link>
            <Link href={METHODS[2].href} className="btn-secondary">
              <Sparkles size={16} /> {tr.methodsList["graphical-lp"].title}
            </Link>
          </div>
        </div>
      </motion.section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">{tr.methods}</h2>
          <Link href="/methods" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400">
            {tr.explore} →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {METHODS.map((m, i) => {
            const meta = tr.methodsList[m.id];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="h-full"
              >
                <ModuleCard
                  method={m}
                  title={meta.title}
                  description={meta.desc}
                  openLabel={tr.openLab}
                  variant="grid"
                />
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
