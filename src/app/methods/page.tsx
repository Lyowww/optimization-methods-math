"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { METHODS } from "@/lib/methods";

export default function MethodsPage() {
  const { tr } = useApp();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold">{tr.selectMethod}</h1>
      <p className="mt-2 text-lab-muted">{tr.tagline}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {METHODS.map((m, i) => {
          const meta = tr.methodsList[m.id];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={m.href}
                className={`glass-card flex items-start gap-4 p-6 transition hover:scale-[1.01] hover:border-cyan-500/30`}
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-2xl text-white`}
                >
                  {m.icon}
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{meta.title}</h2>
                  <p className="mt-1 text-sm text-lab-muted">{meta.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
