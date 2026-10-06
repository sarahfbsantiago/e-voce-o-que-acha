import Link from "next/link";
import { BrazilMark } from "@/components/brand/BrazilMark";
import { MobileMenu } from "@/components/MobileMenu";

const NAV = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/metodologia", label: "Metodologia" },
  { href: "/fontes", label: "Fontes" },
  { href: "/privacidade", label: "Privacidade e dados" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80 sticky top-0">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <BrazilMark size={30} className="shrink-0" />
          Você decide
        </Link>
        <nav aria-label="Principal" className="hidden md:flex items-center gap-5 text-sm text-ink-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="relative py-1 transition-colors hover:text-accent after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-accent after:via-purple after:to-mint after:transition-transform after:duration-300 hover:after:scale-x-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <MobileMenu items={NAV} />
      </div>
    </header>
  );
}
