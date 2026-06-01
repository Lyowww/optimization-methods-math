"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MethodLabLayoutProps {
  title: string;
  description: string;
  input: ReactNode;
  chart: ReactNode;
  results: ReactNode;
  actions: ReactNode;
}

export function MethodLabLayout({
  title,
  description,
  input,
  chart,
  results,
  actions,
}: MethodLabLayoutProps) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header>
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl font-bold md:text-3xl"
        >
          {title}
        </motion.h1>
        <p className="mt-1 max-w-2xl text-sm text-lab-muted">{description}</p>
        <div className="mt-4">{actions}</div>
      </header>

      <div id="lab-export-root" className="grid gap-6 xl:grid-cols-12">
        <section className="glass-card p-5 xl:col-span-3">{input}</section>
        <section className="glass-card p-4 xl:col-span-6">{chart}</section>
        <section className="glass-card p-5 xl:col-span-3">{results}</section>
      </div>
    </div>
  );
}
