import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-h-11";
const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-purple to-purple-strong text-white shadow-md shadow-purple/30 hover:shadow-lg hover:shadow-purple/40 hover:from-purple-strong hover:to-purple-strong",
  secondary:
    "border border-line-strong bg-surface/80 text-ink shadow-sm backdrop-blur hover:border-purple/50 hover:bg-purple-soft hover:text-purple-strong hover:shadow-md",
  ghost: "text-purple-strong hover:bg-purple-soft",
};

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={`${base} ${variants[variant]} ${className}`} />;
}

export function Eyebrow({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "accent" | "mint" | "gold" }) {
  const tones = {
    purple: "border-purple/30 bg-purple-soft text-purple-strong",
    accent: "border-accent/30 bg-accent-soft text-accent-strong",
    mint: "border-mint/30 bg-mint-soft text-mint-strong",
    gold: "border-gold/30 bg-gold-soft text-gold-strong",
  };
  const dot = { purple: "bg-purple", accent: "bg-accent", mint: "bg-mint", gold: "bg-gold" };
  return (
    <span className={`chip inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot[tone]}`} />
      {children}
    </span>
  );
}

export function PageTitle({ children, lead, eyebrow, tone = "purple" }: { children: ReactNode; lead?: ReactNode; eyebrow?: ReactNode; tone?: "purple" | "accent" | "mint" | "gold" }) {
  return (
    <div className="animate-fade-up mb-7 sm:mb-10 not-prose">
      {eyebrow ? <div className="mb-3"><Eyebrow tone={tone}>{eyebrow}</Eyebrow></div> : null}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{children}</h1>
      <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-accent via-purple to-mint" />
      {lead ? <p className="mt-3 text-base sm:text-lg text-ink-2 max-w-3xl">{lead}</p> : null}
    </div>
  );
}
