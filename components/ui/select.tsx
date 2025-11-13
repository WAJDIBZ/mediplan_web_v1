"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseStyles =
  "w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#111827] shadow-sm transition focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] disabled:cursor-not-allowed disabled:bg-[#f9fafb]";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(baseStyles, className)} {...props}>
      {children}
    </select>
  ),
);

Select.displayName = "Select";
