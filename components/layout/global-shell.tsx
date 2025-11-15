"use client";

import { ReactNode, useEffect, useState } from "react";
import { MedTerminalLoader } from "@/components/ui/med-terminal-loader";

interface GlobalShellProps {
  children: ReactNode;
}

export function GlobalShell({ children }: GlobalShellProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const markReady = () => setIsReady(true);

    if (document.readyState === "complete") {
      setIsReady(true);
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 1500);

    return () => {
      window.removeEventListener("load", markReady);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {!isReady && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
          <MedTerminalLoader message="🔄 Initialisation..." />
        </div>
      )}
      {children}
    </div>
  );
}
