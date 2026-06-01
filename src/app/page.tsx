"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import { useApp } from "@/context/AppProviders";
import { METHODS } from "@/lib/methods";

export default function HomePage() {
  const { tr } = useApp();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden p-8 md:p-12"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-300">
            <FlaskConical size={14} />
            Optimization Visual Lab
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">{tr.appName}</h1>
          <p className="mt-4 max-w-2xl text-base text-lab-muted md:text-lg">{tr.homeHero}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/methods" className="btn-primary">
              {tr.explore} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">{tr.methods}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METHODS.map((m, i) => {
            const meta = tr.methodsList[m.id];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={m.href}
                  className="glass-card group block h-full p-5 transition hover:border-cyan-500/40 hover:shadow-lg"
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-xl text-white shadow-md`}
                  >
                    {m.icon}
                  </div>
                  <h3 className="font-semibold group-hover:text-cyan-500">{meta.title}</h3>
                  <p className="mt-1 text-sm text-lab-muted">{meta.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
