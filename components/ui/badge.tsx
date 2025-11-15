"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "success" | "warning" | "neutral" | "danger" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/80",
  warning: "bg-amber-100/80 text-amber-700 border border-amber-200/80",
  neutral: "bg-slate-100/70 text-slate-600 border border-slate-200/70",
  danger: "bg-rose-100/80 text-rose-700 border border-rose-200/80",
  info: "bg-sky-100/80 text-sky-700 border border-sky-200/80",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
