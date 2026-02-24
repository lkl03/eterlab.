import Link from "next/link";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Small section label inspired by Fabrica (plus icon + subtle pill).
 * - Uses dark hover to create contrast
 * - Same component can be used as a link or a button
 */
export function SectionTag({ children, href, onClick, className, ariaLabel }: Props) {
  const base = cx(
    // wider + prevent wrapping + graceful overflow
    "group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-1 text-xs font-semibold tracking-tight text-ink/70 backdrop-blur",
    "whitespace-nowrap max-w-[220px] sm:max-w-[260px]",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
    "hover:-translate-y-[1px] hover:bg-ink hover:text-white hover:border-ink hover:shadow-[0_12px_40px_rgba(17,17,26,0.12)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15",
    className
  );

  const content = (
    <>
      <span className="grid h-5 w-5 place-items-center rounded-full bg-ink/[0.06] text-ink/70 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white">
        <Plus className="h-[14px] w-[14px] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-90" />
      </span>
      <span className="translate-y-[0.5px] truncate">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={base}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={base}>
      {content}
    </button>
  );
}
