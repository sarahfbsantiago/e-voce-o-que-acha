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
import { CANDIDATE_SPECTRUM, IDEOLOGY_RANGES, SPECTRUM_BANDS, closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";

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
    /** Ideologia de cada questionário na régua do espectro (mesma conta do relatório), só em contagens. */
    ideology: aggregateIdeology(submissions),
  };
}

/** Quantos questionários caíram em cada ideologia e de qual candidato ficaram mais perto na régua. */
export function aggregateIdeology(submissions: SubmissionLike[]) {
  const counts = new Map<string, number>(IDEOLOGY_RANGES.map((r) => [r.label, 0]));
  const byBand = SPECTRUM_BANDS.map(() => 0);
  const closer = new Map<string, number>(Object.keys(CANDIDATE_SPECTRUM).map((id) => [id, 0]));
  let total = 0;
  for (const s of submissions) {
    const p = personSpectrum(s.answers);
    if (!p) continue;
    total++;
    counts.set(p.ideology, (counts.get(p.ideology) ?? 0) + 1);
    byBand[Math.min(SPECTRUM_BANDS.length - 1, Math.max(0, Math.floor(p.at)))]++;
    const c = closestCandidateOnRuler(p.at, [...closer.keys()]);
    if (c) closer.set(c, (closer.get(c) ?? 0) + 1);
  }
  const share = (n: number) => (total ? Math.round((n / total) * 1000) / 10 : null);
  return {
    total,
    byIdeology: IDEOLOGY_RANGES.map((r) => {
      const n = counts.get(r.label) ?? 0;
      return { label: r.label, count: n, share: share(n) };
    }),
    byBand: SPECTRUM_BANDS.map((b, i) => ({ label: b.label, color: b.color, count: byBand[i], share: share(byBand[i]) })),
    closerOnRuler: [...closer.entries()].map(([candidateId, n]) => ({ candidateId, count: n, share: share(n) })),
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
