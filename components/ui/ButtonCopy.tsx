import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "light" | "dark" | "ghost";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  href,
  onClick,
  variant = "light",
  className,
  ariaLabel,
  disabled,
}: Props) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-2 text-sm font-medium tracking-tight " +
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 " +
    "hover:-translate-y-[1px] active:translate-y-0 " +
    "[&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-[cubic-bezier(0.76,0,0.24,1)] hover:[&>svg]:translate-x-[2px]";

  const shine =
    "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-[120%] before:opacity-0 " +
    "before:transition-[transform,opacity] before:duration-700 before:ease-[cubic-bezier(0.76,0,0.24,1)] " +
    "hover:before:opacity-100 hover:before:translate-x-[120%]";

  const variants: Record<Variant, string> = {
    light:
      "bg-paper text-ink border-ink/15 shadow-[0_10px_40px_rgba(17,17,26,0.06)] " +
      "hover:bg-paperMuted hover:border-ink/20 hover:shadow-[0_16px_55px_rgba(17,17,26,0.10)] " +
      "before:bg-[linear-gradient(110deg,transparent,rgba(17,17,26,0.06),transparent)]",
    dark:
      "bg-ink text-white border-ink shadow-[0_14px_60px_rgba(17,17,26,0.22)] " +
      "hover:bg-ink/90 hover:shadow-[0_18px_70px_rgba(17,17,26,0.28)] " +
      "before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)]",
    ghost:
      "bg-transparent text-ink border-transparent " +
      "hover:bg-ink/[0.04] hover:shadow-[0_12px_42px_rgba(17,17,26,0.06)] " +
      "before:bg-[linear-gradient(110deg,transparent,rgba(17,17,26,0.06),transparent)]",
  };

  const cls = cx(base, shine, variants[variant], disabled && "opacity-50 pointer-events-none", className);

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={disabled ? undefined : onClick} aria-label={ariaLabel} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}
