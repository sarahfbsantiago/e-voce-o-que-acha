import Link from "next/link";

const LINKS = [
  { href: "/admin/research", label: "Dados da pesquisa", icon: "◔" },
  { href: "/admin/posicoes", label: "Revisão de posições", icon: "✓" },
  { href: "/admin/notas", label: "Notas por alternativa", icon: "★" },
  { href: "/admin/espectro", label: "Espectro político", icon: "↔" },
];

/** Menu do painel administrativo: liga as páginas do admin entre si e ao site E Você, O Que Acha?. */
export function AdminNav({ current }: { current: string }) {
  return (
    <nav aria-label="Painel administrativo" className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-surface p-1.5 text-sm shadow-sm ring-1 ring-black/5 print:hidden">
      <span className="flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wide text-ink-2">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple to-[#2563eb]" />Admin
      </span>
      {LINKS.map((l) => {
        const active = current === l.href;
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors ${active ? "bg-gradient-to-r from-purple to-[#2563eb] font-semibold text-white shadow-sm" : "text-ink-2 hover:bg-paper"}`}>
            <span aria-hidden="true" className="text-xs opacity-80">{l.icon}</span>{l.label}
          </Link>
        );
      })}
      <a href="/" target="_blank" rel="noopener" className="ml-auto inline-flex min-h-9 items-center rounded-xl px-3 py-1.5 text-ink-2 hover:bg-paper">Ver o site ↗</a>
    </nav>
  );
}
