import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import {
  aggregateFeedback,
  aggregatePriorities,
  aggregateQuestion,
  dailySeries,
  demographicDistribution,
  MIN_AGGREGATE_GROUP_SIZE,
  type FeedbackLike,
  type SubmissionLike,
} from "@/domain/aggregates";
import { STATISTICS_DISCLAIMER } from "@/domain/neutrality";

/**
 * Relatório agregado para o painel administrativo privado.
 * Só agregações. Nenhum registro individual. Nenhuma intenção de voto.
 */
export function buildResearchReport(submissions: SubmissionLike[], feedback: FeedbackLike[]) {
  const total = submissions.length;
  const completed = submissions.filter((s) => s.answers.length >= QUESTIONS.length).length;
  return {
    disclaimer: STATISTICS_DISCLAIMER,
    generatedAt: new Date().toISOString(),
    minAggregateGroupSize: MIN_AGGREGATE_GROUP_SIZE,
    overview: {
      totalSubmissions: total,
      completedAllQuestions: completed,
      completionRate: total ? Math.round((completed / total) * 1000) / 10 : null,
    },
    questions: QUESTIONS.map((q) => {
      const agg = aggregateQuestion(q.id, q.options.map((o) => o.id), submissions);
      const noOpinionIds = new Set(q.options.filter((o) => o.isNoOpinion).map((o) => o.id));
      const noOpinion = agg.options.filter((o) => noOpinionIds.has(o.optionId)).reduce((s, o) => s + o.count, 0);
      return {
        questionId: q.id,
        topicId: q.topicId,
        text: q.text,
        totalResponses: agg.totalResponses,
        noOpinionCount: noOpinion,
        options: agg.options.map((o) => ({ ...o, label: q.options.find((x) => x.id === o.optionId)?.label ?? o.optionId })),
      };
    }),
    priorities: aggregatePriorities(TOPICS.map((t) => t.id), submissions).map((p) => ({
      ...p,
      topicName: TOPICS.find((t) => t.id === p.topicId)?.name ?? p.topicId,
    })),
    timeline: dailySeries(submissions),
    demographics: {
      ageRange: demographicDistribution(submissions.map((s) => s.optionalAgeRange)),
      region: demographicDistribution(submissions.map((s) => s.optionalRegion)),
    },
    feedback: aggregateFeedback(feedback),
  };
}

export type ResearchReport = ReturnType<typeof buildResearchReport>;

/** Exportação CSV das agregações por pergunta/alternativa. */
export function researchReportToCsv(report: ResearchReport): string {
  const lines = ["questionId,topicId,optionId,optionLabel,count,shareOfResponses,totalResponses"];
  for (const q of report.questions) {
    for (const o of q.options) {
      const label = `"${o.label.replaceAll('"', '""')}"`;
      lines.push([q.questionId, q.topicId, o.optionId, label, o.count, o.shareOfResponses, q.totalResponses].join(","));
    }
  }
  return lines.join("\n");
}
