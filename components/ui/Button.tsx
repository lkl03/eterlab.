"use client";

import Link from "next/link";
import React from "react";

type Variant = "dark" | "light" | "ghost";

type Props = {
  children: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all duration-200 ease-in-out cursor-pointer select-none";

const shadows = {
  idle: "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
  hover: "hover:shadow-[rgba(0,0,0,0.06)_0px_2px_4px_0px_inset]",
};

const variants: Record<Variant, string> = {
  dark: `bg-ink text-white border border-ink/10 ${shadows.idle} ${shadows.hover} hover:-translate-y-[1px]`,
  light: `bg-white text-ink border border-ink/10 ${shadows.idle} ${shadows.hover} hover:-translate-y-[1px]`,
  ghost: `bg-transparent text-ink/80 border border-ink/10 ${shadows.idle} ${shadows.hover} hover:text-ink hover:-translate-y-[1px]`,
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function Button({
  children,
  href,
  ariaLabel,
  onClick,
  disabled,
  variant = "light",
  className = "",
  type = "button",
}: Props) {
  const cls = `${base} ${variants[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  if (href && !disabled) {
    if (isExternal(href)) {
      return (
        <a
          href={href}
          aria-label={ariaLabel}
          className={cls}
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} aria-label={ariaLabel} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

