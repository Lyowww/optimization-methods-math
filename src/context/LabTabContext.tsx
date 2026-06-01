"use client";

import { createContext, useContext, type ReactNode } from "react";

const LabTabContext = createContext<string>("input");

export function LabTabProvider({ activeTab, children }: { activeTab: string; children: ReactNode }) {
  return <LabTabContext.Provider value={activeTab}>{children}</LabTabContext.Provider>;
}

export function useLabTab() {
  return useContext(LabTabContext);
}
