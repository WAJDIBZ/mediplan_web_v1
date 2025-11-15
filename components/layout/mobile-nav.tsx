"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/layout/sidebar-link";

interface MobileNavItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface MobileNavProps {
  brandLabel: string;
  description: string;
  items: MobileNavItem[];
}

export function MobileNav({ brandLabel, description, items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <div className="relative rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-sky-900/10 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sky-500">{brandLabel}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Navigation</p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm shadow-slate-900/5 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className="sr-only">{open ? "Fermer" : "Ouvrir"} la navigation</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">{description}</p>
      </div>

      <div
        id="mobile-nav-drawer"
        className={`fixed inset-0 z-50 transform transition duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation principale"
      >
        <button
          type="button"
          className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!open}
          onClick={close}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[min(320px,90vw)] flex-col gap-4 border-l border-white/40 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-500">{brandLabel}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Menu principal</p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              onClick={close}
              aria-label="Fermer le menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <nav className="mt-6 flex flex-col gap-3">
            {items.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isCondensed
                onNavigate={close}
                isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>
          <div className="mt-auto rounded-3xl border border-slate-200/60 bg-slate-50/90 p-5 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Besoin d’aide ?</p>
            <p className="mt-2">
              Consultez la documentation MediPlan ou contactez notre support à
              {" "}
              <Link href="mailto:support@mediplan.fr" className="font-semibold text-sky-600">
                support@mediplan.fr
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
