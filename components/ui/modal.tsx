"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-10 backdrop-blur-sm">
      <div
        className={cn(
          "animate-in-up relative w-full overflow-hidden rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur-xl",
          size === "lg" ? "max-w-3xl" : "max-w-xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="Fermer la fenêtre modale"
        >
          ×
        </button>
        <div className="mb-4 pr-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-50/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
            Fenêtre
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        </div>
        <div className="space-y-4 overflow-y-auto pb-4 text-slate-700">{children}</div>
        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        ) : (
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
