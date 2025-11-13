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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a66] px-4">
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl",
          size === "lg" ? "max-w-3xl" : "max-w-xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#64748b] transition hover:text-[#1f2937]"
          aria-label="Fermer la fenêtre modale"
        >
          ×
        </button>
        <div className="mb-4 pr-6">
          <h2 className="text-xl font-semibold text-[#0f172a]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[#64748b]">{description}</p>}
        </div>
        <div className="space-y-4 overflow-y-auto pb-4 text-[#0f172a]">{children}</div>
        {footer ? (
          <div className="mt-6 flex justify-end space-x-3">{footer}</div>
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
