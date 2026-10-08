import type { Question, Topic } from "@/domain/types";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";

/**
 * Ordem oficial das perguntas: a mesma do questionário (5 seções, na ordem das áreas;
 * dentro de cada seção, temas e perguntas na ordem cadastrada).
 * Os ids (q01…q52) são códigos internos e têm buracos por causa das perguntas removidas;
 * para mostrar às pessoas, usar sempre o número desta ordem (1…46).
 */
export const ORDERED_TOPICS: Topic[] = AREA_GROUPS.flatMap((g) =>
  TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order),
);

export const ORDERED_QUESTIONS: Question[] = ORDERED_TOPICS.flatMap((t) =>
  QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order),
);

export const QUESTION_NUMBER: Record<string, number> = Object.fromEntries(ORDERED_QUESTIONS.map((q, i) => [q.id, i + 1]));
