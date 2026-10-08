import type {
  CandidatePosition,
  ComparisonIndicator,
  PositionDirection,
  Question,
  UserAnswer,
} from "@/domain/types";
import type { QuestionOption } from "@/domain/types";
import { OPTION_SCORES } from "@/data/option-scores";

/**
 * Indicador visual POR QUESTÃO entre a resposta do usuário e a posição
 * documentada de um candidato.
 *
 * Regras:
 * - Só posições PUBLICADAS (revisadas e aprovadas) são consideradas.
 * - Sem posição publicada, ou direção UNCLEAR: INSUFFICIENT_EVIDENCE (no relatório,
 *   "não se posicionou nas fontes oficiais"; por tema conta como diferente, ver theme-proximity.ts).
 * - Se o usuário marcou "Não sei", não há comparação (null).
 * - O resultado NUNCA é ponderado pela importância do tema nem convertido em nota.
 *   theme-proximity.ts apenas conta iguais e parecidas por tema, com a fórmula pública.
 */

const DIRECTION_VALUE: Record<Exclude<PositionDirection, "UNCLEAR">, number> = {
  SUPPORTS: 2,
  PARTIALLY_SUPPORTS: 1,
  NEUTRAL: 0,
  PARTIALLY_OPPOSES: -1,
  OPPOSES: -2,
};

/** Nota pela regra padrão: 1 na alternativa do candidato, 0,5 na vizinha, 0 nas demais. null = sem posição publicada. */
export function ruleOptionScore(question: Question, option: QuestionOption, position: CandidatePosition | null | undefined): number | null {
  if (!position || position.reviewStatus !== "PUBLISHED" || position.direction === "UNCLEAR") return null;
  const scaled = question.options.filter((o) => !o.isNoOpinion).every((o) => o.normalizedValue !== null);
  if (scaled) {
    const d = Math.abs((option.normalizedValue ?? 0) - DIRECTION_VALUE[position.direction]);
    return d === 0 ? 1 : d === 1 ? 0.5 : 0;
  }
  const closest = question.options.find((o) => o.id === position.closestOptionId);
  if (!closest || closest.isNoOpinion) return null;
  if (closest.id === option.id) return 1;
  return Math.abs(closest.order - option.order) === 1 ? 0.5 : 0;
}

const optionKey = (questionId: string, candidateId: string, optionId: string) => `${questionId}|${candidateId}|${optionId.split("-").pop()}`;

/** A pergunta tem notas revisadas (src/data/option-scores.ts) para este candidato? */
export function hasOptionScores(question: Question, candidateId: string): boolean {
  return question.options.some((o) => OPTION_SCORES[optionKey(question.id, candidateId, o.id)] !== undefined);
}

/** Nota revisada da alternativa, se houver. */
export function reviewedOptionScore(questionId: string, candidateId: string, optionId: string): { score: number; reason: string } | null {
  const v = OPTION_SCORES[optionKey(questionId, candidateId, optionId)];
  return v ? { score: v[0], reason: v[1] } : null;
}

/** Nota final da alternativa na conta: a revisada, se houver; senão a regra padrão (0 sem posição, quando há notas revisadas). */
export function optionScore(question: Question, option: QuestionOption, candidateId: string, position: CandidatePosition | null | undefined): number | null {
  const reviewed = reviewedOptionScore(question.id, candidateId, option.id);
  if (reviewed) return reviewed.score;
  const rule = ruleOptionScore(question, option, position);
  if (rule === null && hasOptionScores(question, candidateId)) return 0;
  return rule;
}

export function compareAnswerToPosition(
  question: Question,
  answer: UserAnswer | undefined,
  position: CandidatePosition | null | undefined,
  candidateId?: string,
): ComparisonIndicator | null {
  if (!answer || answer.optionIds.length === 0) return null;

  const selected = question.options.filter((o) => answer.optionIds.includes(o.id));
  if (selected.length === 0) return null;
  if (selected.every((o) => o.isNoOpinion)) return null;

  // Notas revisadas por alternativa (mesma tabela do admin): valem antes da regra padrão.
  const cid = candidateId ?? position?.candidateId;
  if (cid && hasOptionScores(question, cid)) {
    const best = Math.max(...selected.filter((o) => !o.isNoOpinion).map((o) => optionScore(question, o, cid, position) ?? 0));
    return best >= 1 ? "SIMILAR" : best >= 0.5 ? "PARTIALLY_SIMILAR" : "DIFFERENT";
  }

  if (!position || position.reviewStatus !== "PUBLISHED" || position.direction === "UNCLEAR") {
    return "INSUFFICIENT_EVIDENCE";
  }

  // Escala ordinal (concordância ou alternativas com valor normalizado).
  const userValues = selected.map((o) => o.normalizedValue).filter((v): v is number => v !== null);
  if (question.kind === "AGREEMENT" || (userValues.length === selected.length && userValues.length > 0)) {
    const candidateValue = DIRECTION_VALUE[position.direction];
    const distance = Math.min(...userValues.map((v) => Math.abs(v - candidateValue)));
    if (distance === 0) return "SIMILAR";
    if (distance === 1) return "PARTIALLY_SIMILAR";
    return "DIFFERENT";
  }

  // Alternativas específicas: compara com a alternativa mais próxima da posição documentada.
  if (!position.closestOptionId) return "INSUFFICIENT_EVIDENCE";
  const closest = question.options.find((o) => o.id === position.closestOptionId);
  if (!closest || closest.isNoOpinion) return "INSUFFICIENT_EVIDENCE";

  if (selected.some((o) => o.id === closest.id)) return "SIMILAR";
  const adjacent = selected.some((o) => !o.isNoOpinion && Math.abs(o.order - closest.order) === 1);
  return adjacent ? "PARTIALLY_SIMILAR" : "DIFFERENT";
}
