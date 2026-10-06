import { COMPARISON_LABELS, type ComparisonIndicator } from "@/domain/types";

/** Indicador por questão. Forma + texto, nunca só cor. Nunca agregado. */
const SHAPE: Record<ComparisonIndicator, string> = {
  SIMILAR: "●",
  PARTIALLY_SIMILAR: "◐",
  DIFFERENT: "○",
  INSUFFICIENT_EVIDENCE: "—",
};

export function ComparisonBadge({ indicator }: { indicator: ComparisonIndicator | null }) {
  if (indicator === null) {
    return <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-ink-3">Você não informou posição nesta questão</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2 py-1 text-xs font-medium text-ink-2">
      <span aria-hidden="true">{SHAPE[indicator]}</span>
      {COMPARISON_LABELS[indicator]}
    </span>
  );
}
