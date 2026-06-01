"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHODS } from "@/lib/methods";
import { useApp } from "@/context/AppProviders";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Home, LayoutGrid, X } from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { tr } = useApp();

  const linkClass = (active: boolean) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      active
        ? "bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-700 dark:text-cyan-300"
        : "text-lab-muted hover:bg-slate-500/10 hover:text-lab-text"
    }`;

  const nav = (
    <div className="flex h-full flex-col p-4">
      <Link href="/" className="mb-6 flex items-center gap-3 rounded-xl px-2 py-1" onClick={onClose}>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20">
          <FlaskConical size={22} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold leading-snug">{tr.appNameShort}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-cyan-600/80 dark:text-cyan-400/80">
            Optimization Lab
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <Link href="/" onClick={onClose} className={linkClass(pathname === "/")}>
          <Home size={18} className="shrink-0 opacity-80" />
          {tr.dashboard}
        </Link>
        <Link href="/methods" onClick={onClose} className={linkClass(pathname === "/methods")}>
          <LayoutGrid size={18} className="shrink-0 opacity-80" />
          {tr.methods}
        </Link>

        <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-widest text-lab-muted">
          {tr.sidebar}
        </p>
        {METHODS.map((m) => {
          const meta = tr.methodsList[m.id];
          const active = pathname.startsWith(m.href);
          return (
            <Link key={m.id} href={m.href} onClick={onClose} className={linkClass(active)}>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm text-white shadow-sm ${m.color}`}
              >
                {m.icon}
              </span>
              <span className="truncate leading-tight">{meta.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="glass-card fixed left-0 top-0 z-40 hidden h-screen w-[17rem] border-r lg:block">
        {nav}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onClose}
              aria-label="Close overlay"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="glass-card fixed left-0 top-0 z-50 h-screen w-[min(17rem,88vw)] border-r shadow-glass-lg lg:hidden"
            >
              <button
                type="button"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-lab-border hover:bg-slate-500/10"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
