import Link from "next/link";
import { BrazilMark } from "@/components/brand/BrazilMark";
import { CURRENT_METHODOLOGY_VERSION, POLITICAL_DATA_UPDATED_AT } from "@/data/methodology";
import { formatDate } from "@/lib/format";

const LINKS = [
  { href: "/fontes", label: "Fontes utilizadas" },
  { href: "/metodologia", label: "Metodologia" },
  { href: "/metodologia#historico", label: "Histórico de alterações" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer relative z-10 border-t border-line mt-20 bg-surface">
      <div className="container-page py-8 md:py-14 text-sm text-ink-2">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <BrazilMark size={26} className="shrink-0" />
              Menos Pior
            </p>
            <p className="mt-3 leading-relaxed">
              Este site não diz em quem você deve votar. Ele organiza evidências públicas para você
              tirar a própria conclusão.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Transparência</p>
            <dl className="mt-3 space-y-4">
              <div>
                <dt className="text-ink-3">Dados políticos e legislativos atualizados em</dt>
                <dd className="mt-0.5 text-ink">
                  <time dateTime={POLITICAL_DATA_UPDATED_AT}>{formatDate(POLITICAL_DATA_UPDATED_AT)}</time>
                </dd>
              </div>
              <div>
                <dt className="text-ink-3">Metodologia</dt>
                <dd className="mt-0.5 text-ink">versão {CURRENT_METHODOLOGY_VERSION}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Rodapé">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Navegação</p>
            <ul className="mt-3 space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:text-accent hover:decoration-purple"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-center text-xs text-ink-3">
          Projeto independente e sem fins eleitorais. Todas as afirmações sobre candidatos apontam para a fonte original.
        </p>
      </div>
    </footer>
  );
}
