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
    <div className="mt-4 flex items-center justify-end space-x-2">
      <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Précédent
      </Button>
      {pages.map((index) => (
        <Button
          key={index}
          size="sm"
          variant={index === page ? "primary" : "secondary"}
          onClick={() => onChange(index)}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="sm"
        disabled={page === pageCount - 1}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </Button>
    </div>
  );
}
