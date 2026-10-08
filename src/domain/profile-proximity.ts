import type { Candidate, CandidatePosition, Question, UserAnswer } from "@/domain/types";
import { compareAnswerToPosition } from "@/domain/comparison";
import { themeProximity } from "@/domain/theme-proximity";

/**
 * "Qual candidato está mais próximo do seu perfil": a mesma conta aberta do relatório,
 * em forma pura, para que o painel administrativo agregue os questionários enviados com
 * exatamente as mesmas regras que a pessoa vê.
 *
 * - Por tema: themeProximity (iguais = 1, parecidas = 0,5, silêncio conta como diferente).
 * - Perfil: quem ficou mais perto em mais temas; empate em temas → TIE; nenhum tema
 *   comparável → NO_COMPARISON.
 * - Nunca pondera pela importância declarada, nunca vira nota, nunca é intenção de voto.
 */
export interface CandidateProfileTotals {
  candidateId: string;
  /** perguntas respondidas (com posição + silêncios) */
  answered: number;
  documented: number;
  silent: number;
  similar: number;
  partiallySimilar: number;
  different: number;
  /** temas em que este candidato ficou mais perto */
  themes: number;
  /** (iguais + 0,5 × parecidas) ÷ respondidas, em %; null sem perguntas respondidas */
  agreement: number | null;
}

export interface ProfileProximityOutcome {
  totals: CandidateProfileTotals[];
  /** temas em que algum candidato ficou mais perto */
  decidedThemes: number;
  closestCandidateId: string | null;
  reason: "NO_COMPARISON" | "TIE" | null;
}

export function profileProximity(
  questions: Question[],
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: CandidatePosition[],
): ProfileProximityOutcome {
  const topicIds = [...new Set(questions.map((q) => q.topicId))];
  const themes = topicIds.map((t) => themeProximity(questions.filter((q) => q.topicId === t), answers, candidates, positions));
  const answerByQ = new Map(answers.map((a) => [a.questionId, a]));

  const totals: CandidateProfileTotals[] = candidates.map((c) => {
    let documented = 0, silent = 0, similar = 0, partiallySimilar = 0, different = 0;
    for (const q of questions) {
      const pos = positions.find((x) => x.candidateId === c.id && x.questionId === q.id) ?? null;
      const r = compareAnswerToPosition(q, answerByQ.get(q.id), pos, c.id);
      if (!r) continue;
      if (r === "INSUFFICIENT_EVIDENCE") { silent++; continue; }
      documented++;
      if (r === "SIMILAR") similar++; else if (r === "PARTIALLY_SIMILAR") partiallySimilar++; else different++;
    }
    const answered = documented + silent;
    return {
      candidateId: c.id, answered, documented, silent, similar, partiallySimilar, different,
      themes: themes.filter((t) => t.closestCandidateId === c.id).length,
      agreement: answered ? ((similar + partiallySimilar / 2) / answered) * 100 : null,
    };
  });

  const decidedThemes = themes.filter((t) => t.closestCandidateId).length;
  if (decidedThemes === 0) return { totals, decidedThemes, closestCandidateId: null, reason: "NO_COMPARISON" };
  const sorted = [...totals].sort((a, b) => b.themes - a.themes);
  if (sorted.length > 1 && sorted[0].themes === sorted[1].themes) return { totals, decidedThemes, closestCandidateId: null, reason: "TIE" };
  return { totals, decidedThemes, closestCandidateId: sorted[0].candidateId, reason: null };
}

export interface ProfileProximityAggregate {
  /** questionários considerados */
  total: number;
  /** questionários com ao menos um tema comparável (base das proporções) */
  withComparison: number;
  byCandidate: {
    candidateId: string;
    /** questionários em que o perfil ficou mais perto deste candidato */
    count: number;
    /** count ÷ withComparison, em %; null sem base */
    share: number | null;
    /** média da concordância individual (%), entre quem respondeu ao menos uma pergunta comparável */
    meanAgreement: number | null;
  }[];
  ties: number;
  noComparison: number;
}

/** Agregação para o painel privado: só contagens e proporções, nenhum registro individual. */
export function aggregateProfileProximity(
  submissions: { answers: UserAnswer[] }[],
  questions: Question[],
  candidates: Candidate[],
  positions: CandidatePosition[],
): ProfileProximityAggregate {
  const outcomes = submissions.map((s) => profileProximity(questions, s.answers, candidates, positions));
  const noComparison = outcomes.filter((o) => o.reason === "NO_COMPARISON").length;
  const ties = outcomes.filter((o) => o.reason === "TIE").length;
  const withComparison = outcomes.length - noComparison;
  const byCandidate = candidates.map((c) => {
    const count = outcomes.filter((o) => o.closestCandidateId === c.id).length;
    const agreements = outcomes.map((o) => o.totals.find((t) => t.candidateId === c.id)?.agreement ?? null).filter((a): a is number => a !== null);
    return {
      candidateId: c.id,
      count,
      share: withComparison ? Math.round((count / withComparison) * 1000) / 10 : null,
      meanAgreement: agreements.length ? Math.round((agreements.reduce((s, a) => s + a, 0) / agreements.length) * 10) / 10 : null,
    };
  });
  return { total: outcomes.length, withComparison, byCandidate, ties, noComparison };
}
