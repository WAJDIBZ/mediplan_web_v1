"use client";

import { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full border-collapse text-left", className)} {...props} />;
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-[#f8fafc] text-xs uppercase text-[#64748b]", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-[#e2e8f0] last:border-0", className)} {...props} />;
}

export function TableHeaderCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-semibold", className)} {...props} />;
}

export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-4 align-top text-sm text-[#0f172a]", className)} {...props} />;
}
