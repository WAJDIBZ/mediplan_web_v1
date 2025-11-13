"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd5f5] bg-[#f8fafc] px-6 py-12 text-center text-sm text-[#475569]",
        className,
      )}
      {...props}
    />
  );
}
