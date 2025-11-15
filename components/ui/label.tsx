"use client";

import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500",
        className,
      )}
      {...props}
    />
  );
}
