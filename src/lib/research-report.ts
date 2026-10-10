import { ORDERED_QUESTIONS, QUESTION_NUMBER } from "@/lib/question-order";
import { TOPICS } from "@/data/topics";
import {
  aggregateFeedback,
  MIN_AGGREGATE_GROUP_SIZE,
  suppressSmallGroup,
  type FeedbackAggregate,
  type FeedbackLike,
  type SubmissionLike,
} from "@/domain/aggregates";
import { STATISTICS_DISCLAIMER } from "@/domain/neutrality";
import type { ProfileProximityAggregate } from "@/domain/profile-proximity";
import { addToTally, emptyTally, ideologyFromTally, type ResearchTally } from "@/lib/research-tally";

/**
 * Relatório agregado para o painel administrativo privado.
 * Só agregações. Nenhum registro individual. Nenhuma intenção de voto.
 * Monta tudo a partir das contagens acumuladas (research-tally), sem precisar dos envios.
 */
export function reportFromTally(t: ResearchTally, feedback: FeedbackAggregate, profileProximity: ProfileProximityAggregate | null = null) {
  const total = t.total;
  return {
    disclaimer: STATISTICS_DISCLAIMER,
    generatedAt: new Date().toISOString(),
    minAggregateGroupSize: MIN_AGGREGATE_GROUP_SIZE,
    overview: {
      totalSubmissions: total,
      completedAllQuestions: t.completed,
      completionRate: total ? Math.round((t.completed / total) * 1000) / 10 : null,
    },
    questions: ORDERED_QUESTIONS.map((q) => {
      const c = t.questions[q.id] ?? { n: 0, o: {} };
      const options = q.options.map((o) => {
        const count = c.o[o.id] ?? 0;
        return { optionId: o.id, count, shareOfResponses: c.n === 0 ? 0 : Math.round((count / c.n) * 1000) / 10, label: o.label };
      });
      const noOpinionIds = new Set(q.options.filter((o) => o.isNoOpinion).map((o) => o.id));
      return {
        questionId: q.id,
        number: QUESTION_NUMBER[q.id],
        topicId: q.topicId,
        text: q.text,
        example: q.example,
        totalResponses: c.n,
        noOpinionCount: options.filter((o) => noOpinionIds.has(o.optionId)).reduce((s, o) => s + o.count, 0),
        options,
      };
    }),
    priorities: TOPICS.map((topic) => {
      const byLevel = t.priorities[topic.id] ?? [0, 0, 0, 0, 0];
      const n = byLevel.reduce((s, x) => s + x, 0);
      return { topicId: topic.id, totalResponses: n, byLevel, shareHighPriority: n === 0 ? 0 : Math.round(((byLevel[3] + byLevel[4]) / n) * 1000) / 10, topicName: topic.name };
    }),
    timeline: Object.entries(t.days).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count })),
    demographics: { ageRange: suppressed(t.age), region: suppressed(t.region) },
    feedback,
    /** Perfil mais próximo por questionário, agregado com as posições publicadas. */
    profileProximity,
    /** Ideologia de cada questionário na régua do espectro (mesma conta do relatório), só em contagens. */
    ideology: ideologyFromTally(t),
  };
}

/** Atalho para poucos envios em memória (testes e scripts). */
export function buildResearchReport(submissions: SubmissionLike[], feedback: FeedbackLike[], profileProximity: ProfileProximityAggregate | null = null) {
  return reportFromTally(addToTally(emptyTally(), submissions, [], null), aggregateFeedback(feedback), profileProximity);
}

function suppressed(counts: Record<string, number>): Record<string, number | null> {
  return Object.fromEntries(Object.entries(counts).map(([k, n]) => [k, suppressSmallGroup(n, n)]));
}

export type ResearchReport = ReturnType<typeof reportFromTally>;

/** Exportação CSV das agregações por pergunta/alternativa. */
export function researchReportToCsv(report: ResearchReport): string {
  const lines = ["numeroPergunta,questionId,topicId,optionId,optionLabel,count,shareOfResponses,totalResponses"];
  for (const q of report.questions) {
    for (const o of q.options) {
      const label = `"${o.label.replaceAll('"', '""')}"`;
      lines.push([QUESTION_NUMBER[q.questionId], q.questionId, q.topicId, o.optionId, label, o.count, o.shareOfResponses, q.totalResponses].join(","));
    }
  }
  return lines.join("\n");
}
