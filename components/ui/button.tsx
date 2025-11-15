"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonSize = "md" | "sm" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseStyles = cn(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-wide transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400",
  "disabled:pointer-events-none disabled:opacity-60",
);

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_18px_45px_-22px_rgba(14,116,144,0.8)] hover:shadow-[0_20px_45px_-18px_rgba(37,99,235,0.45)] active:scale-[0.98]",
  secondary:
    "border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm shadow-slate-900/5 hover:border-slate-300 hover:bg-white",
  ghost:
    "bg-transparent text-sky-600 hover:bg-sky-50/80 hover:text-sky-700",
  danger:
    "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_18px_40px_-20px_rgba(225,29,72,0.75)] hover:shadow-[0_22px_48px_-18px_rgba(225,29,72,0.55)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-4 text-xs",
  md: "min-h-[44px] px-5 text-sm",
  lg: "min-h-[50px] px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || loading}
        aria-busy={loading}
        data-loading={loading ? "true" : undefined}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
