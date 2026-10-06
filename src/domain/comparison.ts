import type {
  CandidatePosition,
  ComparisonIndicator,
  PositionDirection,
  Question,
  UserAnswer,
} from "@/domain/types";

/**
 * Indicador visual POR QUESTÃO entre a resposta do usuário e a posição
 * documentada de um candidato.
 *
 * Regras:
 * - Só posições PUBLICADAS (revisadas e aprovadas) são consideradas.
 * - Sem posição publicada, ou direção UNCLEAR: "Não há evidência suficiente".
 * - Se o usuário marcou "Não sei", não há comparação (null).
 * - O resultado NUNCA é somado, ponderado ou consolidado entre questões.
 *   Não existe, e não deve existir, função que agregue estes indicadores.
 */

const DIRECTION_VALUE: Record<Exclude<PositionDirection, "UNCLEAR">, number> = {
  SUPPORTS: 2,
  PARTIALLY_SUPPORTS: 1,
  NEUTRAL: 0,
  PARTIALLY_OPPOSES: -1,
  OPPOSES: -2,
};

export function compareAnswerToPosition(
  question: Question,
  answer: UserAnswer | undefined,
  position: CandidatePosition | null | undefined,
): ComparisonIndicator | null {
  if (!answer || answer.optionIds.length === 0) return null;

  const selected = question.options.filter((o) => answer.optionIds.includes(o.id));
  if (selected.length === 0) return null;
  if (selected.every((o) => o.isNoOpinion)) return null;

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
