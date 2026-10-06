import type { Candidate, CandidatePosition, ComparisonIndicator, Question, UserAnswer } from "@/domain/types";
import { compareAnswerToPosition } from "./comparison";

/**
 * Proximidade documentada POR TEMA.
 *
 * Para um único tema, conta quantas perguntas receberam o indicador "semelhante" /
 * "parcialmente semelhante" / "diferente" em relação às respostas do usuário.
 *
 * Regras:
 * - Só perguntas que o usuário respondeu (sem "Não sei") entram na contagem.
 * - Perguntas com posição PUBLICADA do candidato são comparadas normalmente.
 * - Perguntas SEM posição documentada do candidato (silêncio) contam como "diferente"
 *   (campo `silent`), para que se abster nunca beneficie o candidato. O site nunca
 *   atribui uma posição nesses casos: mostra "não se posicionou" e explica a regra.
 * - Só há comparação no tema quando pelo menos um candidato tem uma pergunta documentada.
 * - Empate não indica ninguém.
 * - O resultado vale apenas para o tema. NÃO existe, e não deve existir,
 *   função que some temas em um resultado geral.
 */
export interface CandidateThemeCount {
  candidateId: string;
  /** perguntas com posição publicada e comparável */
  documented: number;
  /** perguntas respondidas em que o candidato não tem posição documentada (contam como diferente) */
  silent: number;
  similar: number;
  partiallySimilar: number;
  different: number;
}

export interface ThemeProximity {
  counts: CandidateThemeCount[];
  /** Candidato com maior proximidade documentada no tema, ou null. */
  closestCandidateId: string | null;
  /** Explicação legível quando não há candidato indicado. */
  reason: "INSUFFICIENT_EVIDENCE" | "TIE" | null;
}

export const MIN_DOCUMENTED_PER_CANDIDATE = 1;

export function themeProximity(
  questions: Question[],
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: CandidatePosition[],
): ThemeProximity {
  const answerByQ = new Map(answers.map((a) => [a.questionId, a]));
  const counts: CandidateThemeCount[] = candidates.map((c) => {
    const count: CandidateThemeCount = { candidateId: c.id, documented: 0, silent: 0, similar: 0, partiallySimilar: 0, different: 0 };
    for (const q of questions) {
      const pos = positions.find((p) => p.candidateId === c.id && p.questionId === q.id) ?? null;
      const ind: ComparisonIndicator | null = compareAnswerToPosition(q, answerByQ.get(q.id), pos);
      if (ind === null) continue; // sem resposta ou "Não sei": não entra
      if (ind === "INSUFFICIENT_EVIDENCE") { count.silent += 1; continue; }
      count.documented += 1;
      if (ind === "SIMILAR") count.similar += 1;
      else if (ind === "PARTIALLY_SIMILAR") count.partiallySimilar += 1;
      else count.different += 1;
    }
    return count;
  });

  if (!counts.some((c) => c.documented >= MIN_DOCUMENTED_PER_CANDIDATE)) return { counts, closestCandidateId: null, reason: "INSUFFICIENT_EVIDENCE" };

  // Proporção de "semelhante" (parcial vale metade) sobre perguntas respondidas: documentadas + silêncios (que contam como diferente).
  const score = (c: CandidateThemeCount) => {
    const total = c.documented + c.silent;
    return total === 0 ? 0 : (c.similar + c.partiallySimilar / 2) / total;
  };
  const sorted = [...counts].sort((a, b) => score(b) - score(a));
  if (sorted.length > 1 && score(sorted[0]) === score(sorted[1])) return { counts, closestCandidateId: null, reason: "TIE" };
  return { counts, closestCandidateId: sorted[0].candidateId, reason: null };
}

export function describeProximity(p: ThemeProximity, candidateName: (id: string) => string): string {
  if (p.closestCandidateId) {
    const c = p.counts.find((x) => x.candidateId === p.closestCandidateId)!;
    return `Maior proximidade documentada neste tema: ${candidateName(c.candidateId)} (semelhante em ${c.similar} e parcialmente em ${c.partiallySimilar} de ${c.documented} perguntas com evidência publicada${c.silent ? `; ${c.silent} sem posição, contadas como diferentes` : ""}).`;
  }
  switch (p.reason) {
    case "TIE":
      return "Proximidade documentada equivalente entre os candidatos neste tema.";
    default:
      return "Evidência insuficiente para indicar proximidade neste tema.";
  }
}
