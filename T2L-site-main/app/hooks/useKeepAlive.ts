"use client";

import { useEffect } from "react";

const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes — well under Render's 15 min sleep threshold

export function useKeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch("/api/introspector/health", { method: "GET" }).catch(() => {
        // Silently ignore — this is a best-effort keep-alive, not a health check
      });
    };

    // Ping immediately on mount to warm the backend as soon as the page loads
    ping();

    const interval = setInterval(ping, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}
