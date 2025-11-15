"use client";

import { SVGProps } from "react";

const sharedProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IconProps = SVGProps<SVGSVGElement>;

export function StethoscopeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <path d="M7 3a2 2 0 1 1-2 2v5a7 7 0 0 0 14 0V5a2 2 0 1 1-2-2" />
      <path d="M12 20a3 3 0 1 0 3-3h-2.5" />
      <path d="M11 14.5V17" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="4" />
      <path d="M7 2.5v4" />
      <path d="M17 2.5v4" />
      <path d="M3 10.5h18" />
      <path d="M9 14.5h2" />
      <path d="M13 18.5h2" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <path d="M7 13a4 4 0 1 1 4-4" />
      <path d="M17 13a4 4 0 1 0-4-4" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M21.5 20a6.5 6.5 0 0 0-6.5-5" />
    </svg>
  );
}

export function PillIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <rect x="3.5" y="3" width="17" height="18" rx="6" />
      <path d="m8 16 8-8" />
    </svg>
  );
}

export function AnalyticsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <path d="M4 20h16" />
      <path d="M6 10v7" />
      <path d="M11 6v11" />
      <path d="M16 13v4" />
      <path d="M3 4l3 3 5-5 4 4 5-3" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <path d="M12 3 4.5 6v6.5a8.5 8.5 0 0 0 7.5 8.44 8.5 8.5 0 0 0 7.5-8.44V6z" />
      <path d="M9.5 11.5 11.8 14l3.7-4.5" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...sharedProps} {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M12 3v18" />
    </svg>
  );
}
