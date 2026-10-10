/**
 * Ajustes publicados pelo admin por cima das posições e evidências do banco (Revisão de posições editável).
 * Preenchidos pela configuração viva; vazio = vale o que está no banco.
 */
export interface PositionOverride { summary?: string; direction?: string; closestOptionId?: string | null; reviewStatus?: string }
export interface EvidenceOverride { title?: string; summary?: string; originalExcerpt?: string; link?: string }

export const POSITION_OVERRIDES: Record<string, PositionOverride> = {};
export const EVIDENCE_OVERRIDES: Record<string, EvidenceOverride> = {};

/** Aplica o ajuste do resumo da evidência, trocando o "Documento: link" quando o link mudou. */
export function evidenceSummaryWith(summary: string, o: EvidenceOverride | undefined): string {
  if (!o) return summary;
  const base = o.summary ?? summary.replace(/ Documento: \S+$/, "");
  const link = o.link ?? summary.match(/Documento: (\S+)/)?.[1];
  return link ? `${base} Documento: ${link}` : base;
}
