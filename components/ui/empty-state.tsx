"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-sky-200/80 bg-white/60 px-6 py-14 text-center text-sm text-slate-500 shadow-inner shadow-sky-900/5 backdrop-blur",
        "animate-fade-soft",
        className,
      )}
      {...props}
    />
  );
}
