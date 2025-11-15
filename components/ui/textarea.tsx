"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseStyles =
  "w-full min-h-[120px] rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition-all duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80 disabled:cursor-not-allowed disabled:bg-slate-100/70";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(baseStyles, className)} {...props} />
  ),
);

Textarea.displayName = "Textarea";
