import Link from "next/link";
import { Icon, type IconName } from "@/components/admin/Icon";

const LINKS = [
  { href: "/admin", label: "Como usar", icon: "help" },
  { href: "/admin/research", label: "Dados da pesquisa", icon: "chart" },
  { href: "/admin/posicoes", label: "Revisão de posições", icon: "check" },
  { href: "/admin/notas", label: "Notas e espectro", icon: "star" },
  { href: "/admin/espectro", label: "Régua do espectro", icon: "ruler" },
  { href: "/admin/perguntas", label: "Perguntas", icon: "list" },
  { href: "/admin/textos", label: "Textos do site", icon: "text" },
  { href: "/admin/fontes", label: "Fontes e links", icon: "link" },
  { href: "/admin/sugestoes", label: "Sugestões", icon: "pencil" },
  { href: "/admin/publicar", label: "Publicar", icon: "upload" },
  { href: "/admin/historico", label: "Histórico", icon: "history" },
]

/** Menu do painel administrativo: liga as páginas do admin entre si e ao site E Você, O Que Acha?. */
export function AdminNav({ current }: { current: string }) {
  return (
    <nav aria-label="Painel administrativo" className="-mx-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap bg-surface p-1.5 text-sm shadow-sm ring-1 ring-black/5 md:mx-0 md:flex-wrap md:rounded-2xl print:hidden">
      <span className="hidden items-center gap-2 px-3 text-xs font-bold uppercase tracking-wide text-ink-2 md:flex">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple to-[#2563eb]" />Admin
      </span>
      {LINKS.map((l) => {
        const active = current === l.href;
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all duration-200 ${active ? "bg-gradient-to-r from-purple to-[#2563eb] font-semibold text-white shadow-sm" : "text-ink-2 hover:-translate-y-px hover:bg-paper hover:text-ink"}`}>
            <Icon name={l.icon as IconName} className="h-4 w-4 opacity-80" />{l.label}
          </Link>
        );
      })}
      <a href="/" target="_blank" rel="noopener" className="ml-auto inline-flex min-h-9 shrink-0 items-center rounded-xl px-3 py-1.5 text-ink-2 hover:bg-paper">Ver o site <Icon name="external" className="ml-1 h-3.5 w-3.5" /></a>
    </nav>
  );
}
