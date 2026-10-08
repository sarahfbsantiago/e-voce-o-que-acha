import type { CandidatePosition, Question, QuestionOption } from "@/domain/types";
import { OPTION_SCORE_PROPOSAL } from "@/data/option-score-proposal";

const DIRECTION_VALUE: Record<string, number> = { SUPPORTS: 2, PARTIALLY_SUPPORTS: 1, NEUTRAL: 0, PARTIALLY_OPPOSES: -1, OPPOSES: -2 };

/**
 * Quanto um candidato ganha se a pessoa marcar esta alternativa, pela regra de hoje
 * (mesma de comparison.ts): igual = 1, parecido = 0,5, diferente = 0. null = sem posição publicada.
 */
export function currentOptionScore(question: Question, option: QuestionOption, position: CandidatePosition | undefined): number | null {
  if (!position || position.reviewStatus !== "PUBLISHED" || position.direction === "UNCLEAR") return null;
  const scaled = question.options.filter((o) => !o.isNoOpinion).every((o) => o.normalizedValue !== null);
  if (scaled) {
    const d = Math.abs((option.normalizedValue ?? 0) - DIRECTION_VALUE[position.direction]);
    return d === 0 ? 1 : d === 1 ? 0.5 : 0;
  }
  const closest = question.options.find((o) => o.id === position.closestOptionId);
  if (!closest) return null;
  if (closest.id === option.id) return 1;
  return Math.abs(closest.order - option.order) === 1 ? 0.5 : 0;
}

/** Nota proposta (se houver ajuste diferente da regra de hoje) e o motivo. */
export function proposedOptionScore(questionId: string, candidateId: string, optionId: string): { score: number; reason: string } | null {
  const key = `${questionId}|${candidateId}|${optionId.split("-").pop()}`;
  const p = OPTION_SCORE_PROPOSAL[key];
  return p ? { score: p[0], reason: p[1] } : null;
}
