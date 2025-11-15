"use client";

import { Button } from "./button";

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index);

  return (
    <div className="mt-6 flex items-center justify-end gap-2 rounded-full border border-slate-200/70 bg-white/70 px-2 py-1.5 shadow-inner shadow-slate-900/5 backdrop-blur">
      <Button
        variant="ghost"
        size="sm"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="rounded-full px-3 text-slate-500 hover:text-slate-900"
      >
        Précédent
      </Button>
      {pages.map((index) => (
        <Button
          key={index}
          size="sm"
          variant={index === page ? "primary" : "secondary"}
          className="rounded-full"
          onClick={() => onChange(index)}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={page === pageCount - 1}
        onClick={() => onChange(page + 1)}
        className="rounded-full px-3 text-slate-500 hover:text-slate-900"
      >
        Suivant
      </Button>
    </div>
  );
}
