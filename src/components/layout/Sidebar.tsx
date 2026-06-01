"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHODS } from "@/lib/methods";
import { useApp } from "@/context/AppProviders";
import { motion } from "framer-motion";
import { FlaskConical, Home, Sparkles, X } from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { tr } = useApp();

  const nav = (
    <div className="flex h-full flex-col p-4">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2" onClick={onClose}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg">
          <FlaskConical size={22} />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight">{tr.appName}</p>
          <p className="text-[10px] text-lab-muted">Visual Lab</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            pathname === "/" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "hover:bg-slate-500/10"
          }`}
        >
          <Home size={16} /> {tr.dashboard}
        </Link>
        <Link
          href="/methods"
          onClick={onClose}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            pathname === "/methods" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "hover:bg-slate-500/10"
          }`}
        >
          <Sparkles size={16} /> {tr.methods}
        </Link>
        <Link
          href="/analyze"
          onClick={onClose}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            pathname === "/analyze" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "hover:bg-slate-500/10"
          }`}
        >
          <Sparkles size={16} /> {tr.analyze}
        </Link>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-lab-muted">
          {tr.sidebar}
        </p>
        {METHODS.map((m) => {
          const meta = tr.methodsList[m.id];
          const active = pathname.startsWith(m.href);
          return (
            <Link
              key={m.id}
              href={m.href}
              onClick={onClose}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                active ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "hover:bg-slate-500/10"
              }`}
            >
              <span className="w-5 text-center opacity-80">{m.icon}</span>
              <span className="truncate">{meta.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="glass-card fixed left-0 top-0 z-40 hidden h-screen w-64 border-r lg:block">{nav}</aside>
      {mobileOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          className="glass-card fixed left-0 top-0 z-50 h-screen w-64 border-r lg:hidden"
        >
          <button
            type="button"
            className="absolute right-3 top-3 rounded-lg p-1 hover:bg-slate-500/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {nav}
        </motion.aside>
      )}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Overlay"
        />
      )}
    </>
  );
}
