"use client";

import Link from "next/link";
import { useApp } from "@/context/AppProviders";
import { FlaskConical, Menu, Moon, Sun, Languages } from "lucide-react";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { locale, setLocale, theme, setTheme, tr } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-lab-border/80 bg-lab-card/90 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-5 md:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lab-border transition hover:border-cyan-500/40 hover:bg-cyan-500/5 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand — visible on mobile & desktop */}
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 sm:flex-none lg:hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-md">
            <FlaskConical size={18} />
          </div>
          <span className="truncate font-display text-sm font-bold leading-tight sm:text-base">
            {tr.appNameShort}
          </span>
        </Link>

        <p className="hidden flex-1 text-center text-xs text-lab-muted lg:block xl:text-sm">
          {tr.tagline}
        </p>

        {/* Top-right controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-lab-border bg-slate-900/5 p-1 dark:bg-slate-950/40">
            <Languages size={14} className="ml-1.5 hidden text-lab-muted sm:block" aria-hidden />
            {(["en", "hy"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                title={l === "en" ? "English" : "Հայերեն"}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase transition sm:px-3 ${
                  locale === l
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                    : "text-lab-muted hover:bg-slate-500/10 hover:text-lab-text"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-lab-border transition hover:border-cyan-500/40 hover:bg-cyan-500/5"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={tr.theme}
            title={theme === "dark" ? tr.light : tr.dark}
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-violet-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
