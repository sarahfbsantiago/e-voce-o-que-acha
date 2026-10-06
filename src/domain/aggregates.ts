import type { AgeRange, Region, TopicPriority, UserAnswer } from "@/domain/types";

/**
 * Agregação estatística anônima.
 *
 * - Nunca calcula intenção de voto, projeção ou "vencedor".
 * - Nunca extrapola para a população brasileira: percentuais são sempre
 *   "% das respostas".
 * - Recortes com menos de MIN_AGGREGATE_GROUP_SIZE respostas são suprimidos.
 */
export const MIN_AGGREGATE_GROUP_SIZE = 10;

export const INSUFFICIENT_DATA_MESSAGE = "Dados insuficientes para exibição agregada.";

export interface SubmissionLike {
  id: string;
  submittedAt: string;
  methodologyVersion: string;
  answers: UserAnswer[];
  topicPriorities: TopicPriority[];
  optionalAgeRange: AgeRange | null;
  optionalRegion: Region | null;
}

export interface OptionCount {
  optionId: string;
  count: number;
  /** Percentual das respostas à pergunta (0–100, uma casa decimal). */
  shareOfResponses: number;
}

export interface QuestionAggregate {
  questionId: string;
  totalResponses: number;
  options: OptionCount[];
}

export function aggregateQuestion(questionId: string, optionIds: string[], submissions: SubmissionLike[]): QuestionAggregate {
  const counts = new Map<string, number>(optionIds.map((id) => [id, 0]));
  let total = 0;
  for (const s of submissions) {
    const a = s.answers.find((x) => x.questionId === questionId);
    if (!a || a.optionIds.length === 0) continue;
    total += 1;
    for (const oid of a.optionIds) {
      if (counts.has(oid)) counts.set(oid, (counts.get(oid) ?? 0) + 1);
    }
  }
  return {
    questionId,
    totalResponses: total,
    options: optionIds.map((optionId) => {
      const count = counts.get(optionId) ?? 0;
      return { optionId, count, shareOfResponses: total === 0 ? 0 : Math.round((count / total) * 1000) / 10 };
    }),
  };
}

export interface PriorityAggregate {
  topicId: string;
  totalResponses: number;
  /** Contagem por nível 0..4 */
  byLevel: number[];
  /** Percentual das respostas que marcaram nível 3 ou 4. */
  shareHighPriority: number;
}

export function aggregatePriorities(topicIds: string[], submissions: SubmissionLike[]): PriorityAggregate[] {
  return topicIds.map((topicId) => {
    const byLevel = [0, 0, 0, 0, 0];
    let total = 0;
    for (const s of submissions) {
      const p = s.topicPriorities.find((x) => x.topicId === topicId);
      if (!p) continue;
      total += 1;
      byLevel[p.level] += 1;
    }
    const high = byLevel[3] + byLevel[4];
    return { topicId, totalResponses: total, byLevel, shareHighPriority: total === 0 ? 0 : Math.round((high / total) * 1000) / 10 };
  });
}

/** Retorna null quando o grupo é pequeno demais para exibição agregada. */
export function suppressSmallGroup<T>(count: number, value: T): T | null {
  return count < MIN_AGGREGATE_GROUP_SIZE ? null : value;
}

export function countBy<K extends string>(values: (K | null)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    if (v === null) continue;
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

/** Distribuição demográfica com supressão de grupos pequenos. */
export function demographicDistribution(values: (string | null)[]): Record<string, number | null> {
  const counts = countBy(values);
  const out: Record<string, number | null> = {};
  for (const [k, n] of Object.entries(counts)) out[k] = suppressSmallGroup(n, n);
  return out;
}

/** Série temporal por dia (contagem de questionários concluídos). */
export function dailySeries(submissions: SubmissionLike[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const s of submissions) {
    const day = s.submittedAt.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
}

/** Formata sempre como percentual DAS RESPOSTAS. */
export function formatShare(share: number): string {
  return `${share.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% das respostas`;
}

// ---------------------------------------------------------------------------
// Avaliação da pesquisa
// ---------------------------------------------------------------------------

export interface FeedbackLike {
  id: string;
  submittedAt: string;
  methodologyVersion: string;
  rating: number;
  helpedDecision: boolean | null;
}

export interface FeedbackAggregate {
  total: number;
  averageRating: number | null;
  /** Contagem por nota 1..5 (índice 0 = nota 1). */
  byRating: number[];
  helpedYes: number;
  helpedNo: number;
  helpedUnanswered: number;
  /** Percentual DAS AVALIAÇÕES que responderam "sim" entre as que responderam. */
  shareHelpedYes: number | null;
}

export function aggregateFeedback(items: FeedbackLike[]): FeedbackAggregate {
  const byRating = [0, 0, 0, 0, 0];
  let sum = 0;
  let yes = 0;
  let no = 0;
  let unanswered = 0;
  for (const f of items) {
    if (f.rating >= 1 && f.rating <= 5) {
      byRating[f.rating - 1] += 1;
      sum += f.rating;
    }
    if (f.helpedDecision === true) yes += 1;
    else if (f.helpedDecision === false) no += 1;
    else unanswered += 1;
  }
  const answered = yes + no;
  return {
    total: items.length,
    averageRating: items.length ? Math.round((sum / items.length) * 100) / 100 : null,
    byRating,
    helpedYes: yes,
    helpedNo: no,
    helpedUnanswered: unanswered,
    shareHelpedYes: answered ? Math.round((yes / answered) * 1000) / 10 : null,
  };
}
