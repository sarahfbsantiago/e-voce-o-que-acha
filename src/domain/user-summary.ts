import type { Question, Topic, TopicPriority, UserAnswer } from "@/domain/types";
import { sortTopicsByPriority } from "./ordering";

/**
 * "Seu mapa de prioridades": organiza as respostas do PRÓPRIO usuário.
 * A normalização interna é usada aqui apenas para descrever a tendência das
 * respostas do usuário por tema. Nada aqui envolve candidatos.
 */
export interface TopicSection {
  topic: Topic;
  priorityLevel: number | null;
  answered: number;
  noOpinion: number;
  total: number;
  /** Média dos valores normalizados das respostas em escala ordinal (−2..2), ou null. */
  agreementTendency: number | null;
}

export function buildPriorityMap(
  topics: Topic[],
  questions: Question[],
  answers: UserAnswer[],
  priorities: TopicPriority[],
): TopicSection[] {
  const ordered = sortTopicsByPriority(topics, priorities);
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  return ordered.map((topic) => {
    const qs = questions.filter((q) => q.topicId === topic.id);
    let answered = 0;
    let noOpinion = 0;
    const values: number[] = [];
    for (const q of qs) {
      const a = byId.get(q.id);
      if (!a || a.optionIds.length === 0) continue;
      answered += 1;
      const opts = q.options.filter((o) => a.optionIds.includes(o.id));
      if (opts.every((o) => o.isNoOpinion)) {
        noOpinion += 1;
        continue;
      }
      for (const o of opts) if (o.normalizedValue !== null && !o.isNoOpinion) values.push(o.normalizedValue);
    }
    const p = priorities.find((x) => x.topicId === topic.id);
    return {
      topic,
      priorityLevel: p ? p.level : null,
      answered,
      noOpinion,
      total: qs.length,
      agreementTendency: values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : null,
    };
  });
}
