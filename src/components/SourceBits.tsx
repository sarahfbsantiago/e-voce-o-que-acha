import { SOURCE_LEGEND_LABELS, type SourceLegend, type SourceRegistryEntry } from "@/domain/types";

const LEGEND_SHAPE: Record<SourceLegend, string> = {
  PRIMARIA: "■",
  ESTATISTICA: "▲",
  INSTITUCIONAL: "●",
  ACADEMICA: "◆",
  JORNALISTICA: "○",
};

const LEGEND_TONE: Record<SourceLegend, string> = {
  PRIMARIA: "border-accent/30 bg-accent-soft text-accent-strong",
  ESTATISTICA: "border-mint/30 bg-mint-soft text-mint-strong",
  INSTITUCIONAL: "border-gold/30 bg-gold-soft text-gold-strong",
  ACADEMICA: "border-purple/30 bg-purple-soft text-purple-strong",
  JORNALISTICA: "border-line bg-paper text-ink-2",
};

/** Legenda de fonte: forma + texto + cor (nunca só cor). Clique mostra o significado. */
export function SourceLegendBadge({ legend }: { legend: SourceLegend }) {
  const info = SOURCE_LEGEND_LABELS[legend];
  return (
    <details className="inline-block align-middle">
      <summary className={`chip inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium cursor-pointer ${LEGEND_TONE[legend]}`}>
        <span aria-hidden="true">{LEGEND_SHAPE[legend]}</span>
        {info.label}
      </summary>
      <p className="mt-1 max-w-sm text-xs text-ink-2">{info.meaning}</p>
    </details>
  );
}

export function SourceLink({ source, label = "Ver fonte original" }: { source: SourceRegistryEntry; label?: string }) {
  const href = source.documentUrl ?? source.url;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent underline underline-offset-4 transition-colors hover:text-purple-strong">
      {label} <span aria-hidden="true">↗</span>
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}

export function VerificationNote({ source }: { source: SourceRegistryEntry }) {
  const v = source.verification;
  if (v.status === "VERIFIED") return <span className="text-xs text-ink-3">Link verificado em {v.checkedAt}</span>;
  if (v.status === "PENDING_MANUAL") return <span className="text-xs text-ink-3">Verificação manual do link pendente</span>;
  return <span className="text-xs text-ink-3">Link ainda não verificado</span>;
}
