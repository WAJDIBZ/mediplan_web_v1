"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-slate-200/70",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[mediplan-sheen_1.4s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
