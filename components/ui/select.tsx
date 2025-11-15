"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseStyles =
  "w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition-all duration-200 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80 disabled:cursor-not-allowed disabled:bg-slate-100/70";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(baseStyles, className)} {...props}>
      {children}
    </select>
  ),
);

Select.displayName = "Select";
