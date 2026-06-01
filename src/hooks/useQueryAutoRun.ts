"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function useQueryAutoRun(onAuto: (data: Record<string, unknown>) => void) {
  const params = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (params.get("auto") === "1" && params.get("data")) {
      try {
        const data = JSON.parse(params.get("data") || "{}");
        ran.current = true;
        onAuto(data);
      } catch {
        /* ignore */
      }
    }
  }, [params, onAuto]);
}
