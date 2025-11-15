"use client";

import { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full border-separate border-spacing-0 rounded-[24px] border border-white/60 bg-white/80 text-left text-sm text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "overflow-hidden rounded-t-[24px] bg-sky-50/70 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-slate-200/70 last:border-0 transition-colors duration-200 hover:bg-sky-50/70",
        className,
      )}
      {...props}
    />
  );
}

export function TableHeaderCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500", className)} {...props} />;
}

export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-5 py-5 align-top text-sm text-slate-700 transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("", className)} {...props} />;
}

// Aliases for convenience
export { TableHead as Thead };
export { TableBody as Tbody };
export { TableRow as Tr };
export { TableHeaderCell as Th };
export { TableCell as Td };
