import { QUESTIONS } from "@/data/questions";
import { ORDERED_QUESTIONS, QUESTION_NUMBER } from "@/lib/question-order";
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
import type { ProfileProximityAggregate } from "@/domain/profile-proximity";

/**
 * Relatório agregado para o painel administrativo privado.
 * Só agregações. Nenhum registro individual. Nenhuma intenção de voto.
 */
export function buildResearchReport(submissions: SubmissionLike[], feedback: FeedbackLike[], profileProximity: ProfileProximityAggregate | null = null) {
  const total = submissions.length;
  // Só contam respostas às perguntas atuais: envios antigos podem ter respostas de perguntas removidas.
  const current = new Set(QUESTIONS.map((q) => q.id));
  const completed = submissions.filter((s) => s.answers.filter((a) => current.has(a.questionId)).length >= QUESTIONS.length).length;
  return {
    disclaimer: STATISTICS_DISCLAIMER,
    generatedAt: new Date().toISOString(),
    minAggregateGroupSize: MIN_AGGREGATE_GROUP_SIZE,
    overview: {
      totalSubmissions: total,
      completedAllQuestions: completed,
      completionRate: total ? Math.round((completed / total) * 1000) / 10 : null,
    },
    questions: ORDERED_QUESTIONS.map((q) => {
      const agg = aggregateQuestion(q.id, q.options.map((o) => o.id), submissions);
      const noOpinionIds = new Set(q.options.filter((o) => o.isNoOpinion).map((o) => o.id));
      const noOpinion = agg.options.filter((o) => noOpinionIds.has(o.optionId)).reduce((s, o) => s + o.count, 0);
      return {
        questionId: q.id,
        number: QUESTION_NUMBER[q.id],
        topicId: q.topicId,
        text: q.text,
        example: q.example,
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
    /** Perfil mais próximo por questionário, agregado com as posições publicadas no momento da consulta. */
    profileProximity,
  };
}

export type ResearchReport = ReturnType<typeof buildResearchReport>;

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
