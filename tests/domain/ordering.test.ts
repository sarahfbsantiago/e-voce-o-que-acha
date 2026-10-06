import { describe, expect, it } from "vitest";
import { sortTopicsByPriority } from "@/domain/ordering";
import { TOPICS } from "@/data/topics";

describe("importância dos temas", () => {
  it("altera apenas a ordenação dos temas", () => {
    const sorted = sortTopicsByPriority(TOPICS, [
      { topicId: "t06", level: 4 },
      { topicId: "t01", level: 1 },
      { topicId: "t04", level: 3 },
    ]);
    expect(sorted[0].id).toBe("t06");
    expect(sorted[1].id).toBe("t04");
    // Mesmo conjunto de temas, nada removido nem adicionado
    expect(sorted.map((t) => t.id).sort()).toEqual(TOPICS.map((t) => t.id).sort());
  });

  it("é estável para empates e temas sem importância declarada", () => {
    const sorted = sortTopicsByPriority(TOPICS, []);
    expect(sorted.map((t) => t.id)).toEqual(TOPICS.map((t) => t.id));
  });

  it("não devolve nenhum valor numérico associado a candidatos", () => {
    const sorted = sortTopicsByPriority(TOPICS, [{ topicId: "t06", level: 4 }]);
    for (const t of sorted) expect(Object.keys(t)).not.toContain("score");
  });
});
