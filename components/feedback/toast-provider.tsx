"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  notify: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-[#bbf7d0] bg-[#ecfdf5] text-[#166534]",
  error: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
  info: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
  warning: "border-[#fef3c7] bg-[#fffbeb] text-[#92400e]",
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé dans un ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = ({ variant, title, description }: Omit<Toast, "id">) => {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, variant, title, description }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 flex items-start justify-center sm:justify-end sm:pr-6">
        <div className="flex w-full max-w-sm flex-col space-y-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto rounded-xl border px-4 py-3 shadow-lg",
                variantStyles[toast.variant],
              )}
            >
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && <p className="mt-1 text-sm opacity-80">{toast.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
