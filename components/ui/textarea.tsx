"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseStyles =
  "w-full min-h-[120px] rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#111827] shadow-sm transition focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] disabled:cursor-not-allowed disabled:bg-[#f9fafb]";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(baseStyles, className)} {...props} />
  ),
);

Textarea.displayName = "Textarea";
