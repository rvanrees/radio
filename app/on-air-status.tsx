"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "online" | "offline";

export default function OnAirStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/listeners", { cache: "no-store" });
        const data = (await response.json()) as { online?: boolean };
        setStatus(response.ok && data.online ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };

    void checkStatus();
    const timer = window.setInterval(checkStatus, 10_000);
    return () => window.clearInterval(timer);
  }, []);

  const label = status === "online" ? "On air" : status === "offline" ? "Off air" : "Controleren";

  return (
    <div className={`on-air on-air-${status}`} aria-live="polite">
      <span aria-hidden="true" />
      {label}
    </div>
  );
}
