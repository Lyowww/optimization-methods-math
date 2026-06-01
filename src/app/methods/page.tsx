"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { METHODS } from "@/lib/methods";
import { ModuleCard } from "@/components/modules/ModuleCard";

export default function MethodsPage() {
  const { tr } = useApp();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{tr.selectMethod}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-lab-muted sm:text-base">{tr.tagline}</p>
      </header>

      <div className="flex flex-col gap-4">
        {METHODS.map((m, i) => {
          const meta = tr.methodsList[m.id];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ModuleCard
                method={m}
                title={meta.title}
                description={meta.desc}
                openLabel={tr.openLab}
                variant="list"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
