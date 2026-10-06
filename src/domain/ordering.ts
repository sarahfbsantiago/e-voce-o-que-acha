import type { Topic, TopicPriority } from "@/domain/types";

/**
 * Ordena os temas pela importância declarada pelo usuário.
 *
 * ESTE É O ÚNICO USO da importância dos temas: ordenar o relatório.
 * A importância nunca multiplica, pondera ou pontua posições de candidatos.
 *
 * - Maior importância aparece primeiro.
 * - Empates e temas sem importância declarada preservam a ordem original (sort estável).
 */
export function sortTopicsByPriority(topics: Topic[], priorities: TopicPriority[]): Topic[] {
  const level = new Map(priorities.map((p) => [p.topicId, p.level as number]));
  return [...topics]
    .map((t, index) => ({ t, index, level: level.get(t.id) ?? -1 }))
    .sort((a, b) => (b.level !== a.level ? b.level - a.level : a.index - b.index))
    .map((x) => x.t);
}
