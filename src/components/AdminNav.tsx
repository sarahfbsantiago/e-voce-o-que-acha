import Link from "next/link";

const LINKS = [
  { href: "/admin/research", label: "Dados da pesquisa" },
  { href: "/admin/posicoes", label: "Revisão de posições" },
  { href: "/", label: "Ver o site" },
];

/** Menu do painel administrativo: liga as páginas do admin entre si e ao site Menos Pior. */
export function AdminNav({ current }: { current: string }) {
  return (
    <nav aria-label="Painel administrativo" className="card flex flex-wrap items-center gap-2 p-2 text-sm">
      <span className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-3">Admin · Menos Pior</span>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={current === l.href ? "page" : undefined}
          className={`rounded-lg px-3 py-1.5 min-h-9 inline-flex items-center ${current === l.href ? "bg-purple-soft font-semibold text-purple-strong" : "text-ink-2 hover:bg-paper"}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
