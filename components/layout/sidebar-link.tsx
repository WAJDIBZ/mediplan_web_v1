"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  onNavigate?: () => void;
  isCondensed?: boolean;
  isActive?: boolean;
}

export function SidebarLink({ href, label, icon, onNavigate, isCondensed = false, isActive: forcedActive }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = forcedActive ?? (pathname === href || pathname?.startsWith(`${href}/`));

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      onNavigate();
    }
    event.currentTarget.blur();
  };

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        isActive
          ? "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-900/20"
          : "text-slate-500 hover:text-slate-900 hover:shadow-md hover:shadow-sky-900/5",
        "ring-1 ring-transparent hover:bg-white/70 hover:ring-sky-200/60 backdrop-blur-md",
        isCondensed && "px-3 py-2 text-[13px]",
      )}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {icon && (
        <span
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/80",
            "text-sky-600 shadow-inner shadow-sky-900/5 transition-all duration-300",
            "group-hover:scale-105 group-hover:border-sky-200 group-hover:text-sky-700",
            isActive && "border-white/80 bg-white/90 text-sky-700",
            isCondensed && "h-9 w-9 text-[15px]",
          )}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {isActive && <span className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-white/80" aria-hidden />}
    </Link>
  );
}
