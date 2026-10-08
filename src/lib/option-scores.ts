import type { CandidatePosition, Question, QuestionOption } from "@/domain/types";
import { reviewedOptionScore, ruleOptionScore } from "@/domain/comparison";

/** Nota pela regra padrão (sem a tabela revisada). null = sem posição publicada. */
export function currentOptionScore(question: Question, option: QuestionOption, position: CandidatePosition | undefined): number | null {
  return ruleOptionScore(question, option, position);
}

/** Nota revisada (tabela usada na conta), se houver. */
export function proposedOptionScore(questionId: string, candidateId: string, optionId: string): { score: number; reason: string } | null {
  return reviewedOptionScore(questionId, candidateId, optionId);
}
