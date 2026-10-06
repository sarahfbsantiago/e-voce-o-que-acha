import type {
  CandidatePosition,
  Evidence,
  Indicator,
  ProgramSummary,
  ReviewStatus,
  SourceRegistryEntry,
} from "@/domain/types";
import { findForbiddenPhrases } from "./neutrality";

export interface ValidationResult {
  ok: boolean;
  reasons: string[];
}

/** Apenas conteúdo PUBLICADO aparece na interface pública. */
export function isPubliclyVisible(status: ReviewStatus): boolean {
  return status === "PUBLISHED";
}

/** Evidência aprovada ou publicada pode sustentar uma posição. */
export function isApproved(status: ReviewStatus): boolean {
  return status === "APPROVED" || status === "PUBLISHED";
}

/**
 * Uma evidência só pode ser publicada se:
 * - possui fonte registrada com URL consultável;
 * - foi aprovada em revisão;
 * - possui classificação e força documental;
 * - possui data de consulta.
 */
export function canPublishEvidence(evidence: Evidence, source: SourceRegistryEntry | undefined): ValidationResult {
  const reasons: string[] = [];
  if (!evidence.sourceId || !source) reasons.push("Fonte obrigatória: a evidência não aponta para uma fonte registrada.");
  if (source && !source.url) reasons.push("A fonte registrada não possui URL consultável.");
  if (!isApproved(evidence.reviewStatus)) reasons.push("A evidência precisa estar APPROVED para ser publicada.");
  if (!evidence.classification) reasons.push("Classificação obrigatória (PROPOSTA, POSICAO, ATUACAO ou RESULTADO_OBSERVADO).");
  if (!evidence.evidenceStrength) reasons.push("Força documental obrigatória (A, B, C ou D).");
  if (!evidence.retrievedAt) reasons.push("Data de consulta (retrievedAt) obrigatória.");
  if (!evidence.originalExcerpt?.trim()) reasons.push("Trecho original obrigatório.");
  return { ok: reasons.length === 0, reasons };
}

/**
 * Uma posição de candidato só pode ser publicada se:
 * - possui pelo menos uma evidência aprovada;
 * - não é sustentada exclusivamente por fontes de nível D;
 * - o resumo não contém linguagem de recomendação.
 */
export function canPublishPosition(position: CandidatePosition, evidences: Evidence[]): ValidationResult {
  const reasons: string[] = [];
  const linked = evidences.filter((e) => position.evidenceIds.includes(e.id));
  const approved = linked.filter((e) => isApproved(e.reviewStatus));
  if (approved.length === 0) reasons.push("A posição precisa de pelo menos uma evidência aprovada.");
  if (approved.length > 0 && approved.every((e) => e.evidenceStrength === "D")) {
    reasons.push("Uma posição nunca pode ser determinada exclusivamente por fontes de nível D.");
  }
  const forbidden = findForbiddenPhrases(position.summary);
  if (forbidden.length > 0) reasons.push(`Resumo contém linguagem proibida: ${forbidden.join(", ")}.`);
  return { ok: reasons.length === 0, reasons };
}

/** Indicadores estatísticos exigem período de referência, unidade e data de divulgação. */
export function validateIndicator(indicator: Indicator): ValidationResult {
  const reasons: string[] = [];
  if (!indicator.referencePeriod?.trim()) reasons.push("Período de referência obrigatório.");
  if (!indicator.unit?.trim()) reasons.push("Unidade obrigatória.");
  if (!indicator.releasedAt) reasons.push("Data de divulgação obrigatória.");
  if (!indicator.sourceId) reasons.push("Fonte obrigatória.");
  return { ok: reasons.length === 0, reasons };
}

/** Resumo de programa exige fonte aprovada e linguagem factual. */
export function canPublishProgramSummary(summary: ProgramSummary, source: SourceRegistryEntry | undefined): ValidationResult {
  const reasons: string[] = [];
  if (!source) reasons.push("Fonte obrigatória.");
  if (!isApproved(summary.reviewStatus)) reasons.push("Resumo precisa estar APPROVED.");
  const forbidden = findForbiddenPhrases(summary.summary + " " + summary.title);
  if (forbidden.length > 0) reasons.push(`Resumo contém linguagem proibida: ${forbidden.join(", ")}.`);
  return { ok: reasons.length === 0, reasons };
}

/** Texto de "Resultado observado" não pode atribuir causalidade ao candidato automaticamente. */
const CAUSAL_PATTERNS = [/\bo presidente (reduziu|aumentou|elevou|derrubou|zerou)\b/i, /\bgraças a[o]? (candidato|presidente|governo)\b/i];

export function hasAutomaticCausalClaim(text: string): boolean {
  return CAUSAL_PATTERNS.some((re) => re.test(text));
}
