"use client";

import { useApp } from "@/context/AppProviders";
import { Menu, Moon, Sun } from "lucide-react";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { locale, setLocale, theme, setTheme, tr } = useApp();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-lab-border bg-lab-card/80 px-4 py-3 backdrop-blur-md md:px-6">
      <button type="button" className="rounded-lg p-2 hover:bg-slate-500/10 lg:hidden" onClick={onMenuClick}>
        <Menu size={20} />
      </button>
      <div className="hidden text-sm text-lab-muted lg:block">{tr.tagline}</div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex rounded-lg border border-lab-border p-0.5 text-xs">
          {(["en", "hy"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-md px-2.5 py-1 font-medium uppercase transition ${
                locale === l ? "bg-cyan-500 text-white" : "hover:bg-slate-500/10"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rounded-lg border border-lab-border p-2 transition hover:border-cyan-500/50"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={tr.theme}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
