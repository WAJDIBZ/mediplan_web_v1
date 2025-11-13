"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: string;
}

export function SidebarLink({ href, label, icon }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
        isActive
          ? "bg-[#2563eb] text-white shadow-[0_10px_30px_-15px_rgba(37,99,235,0.8)]"
          : "text-[#475569] hover:bg-[#e0f2fe] hover:text-[#1d4ed8]",
      )}
    >
      {icon && <span aria-hidden>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
