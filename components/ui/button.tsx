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

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-[#2563eb]",
  secondary: "bg-white text-[#1f2937] border border-[#d1d5db] hover:bg-[#f3f4f6] focus-visible:outline-[#1f2937]",
  ghost: "bg-transparent text-[#2563eb] hover:bg-[#eff6ff] focus-visible:outline-[#2563eb]",
  danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:outline-[#ef4444]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
