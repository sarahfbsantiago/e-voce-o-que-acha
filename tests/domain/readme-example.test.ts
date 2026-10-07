import { describe, expect, it } from "vitest";
import { themeProximity } from "@/domain/theme-proximity";
import type { Candidate, CandidatePosition, Question } from "@/domain/types";

/** Reproduz o "Exemplo numérico completo" do README. Se este teste quebrar, o README precisa ser atualizado. */
const opts = (qid: string) => [
  { id: `${qid}-o1`, label: "Concordo", order: 1, normalizedValue: 2, isNoOpinion: false },
  { id: `${qid}-o2`, label: "Concordo em parte", order: 2, normalizedValue: 1, isNoOpinion: false },
  { id: `${qid}-o3`, label: "Discordo em parte", order: 3, normalizedValue: -1, isNoOpinion: false },
  { id: `${qid}-o4`, label: "Discordo", order: 4, normalizedValue: -2, isNoOpinion: false },
  { id: `${qid}-o5`, label: "Não sei", order: 5, normalizedValue: 0, isNoOpinion: true },
];
const qs: Question[] = ["q1", "q2", "q3", "q4"].map((id, i) => ({ id, topicId: "T", order: i + 1, text: id, kind: "AGREEMENT", options: opts(id) }));
const cands = [{ id: "A" }, { id: "B" }] as Candidate[];
const pos = (candidateId: string, questionId: string, direction: CandidatePosition["direction"]): CandidatePosition => ({
  id: `${candidateId}${questionId}`, candidateId, questionId, direction, closestOptionId: null, summary: "", evidenceIds: ["e"], reviewStatus: "PUBLISHED", updatedAt: "x",
});
const answers = [
  { questionId: "q1", optionIds: ["q1-o1"] },
  { questionId: "q2", optionIds: ["q2-o1"] },
  { questionId: "q3", optionIds: ["q3-o4"] },
  { questionId: "q4", optionIds: ["q4-o5"] },
];

describe("exemplo do README", () => {
  it("A = 0,50 e B = 0,67; tema indica B", () => {
    const positions = [
      pos("A", "q1", "SUPPORTS"), pos("A", "q2", "PARTIALLY_SUPPORTS"), pos("A", "q4", "SUPPORTS"),
      pos("B", "q1", "OPPOSES"), pos("B", "q2", "SUPPORTS"), pos("B", "q3", "OPPOSES"), pos("B", "q4", "OPPOSES"),
    ];
    const r = themeProximity(qs, answers, cands, positions);
    expect(r.counts.find((c) => c.candidateId === "A")).toMatchObject({ similar: 1, partiallySimilar: 1, silent: 1, documented: 2 });
    expect(r.counts.find((c) => c.candidateId === "B")).toMatchObject({ similar: 2, different: 1, silent: 0, documented: 3 });
    expect(r.closestCandidateId).toBe("B");
  });
  it("se A tivesse 'opõe-se' em q3, A = 0,83 e passaria a ser o mais próximo", () => {
    const positions = [
      pos("A", "q1", "SUPPORTS"), pos("A", "q2", "PARTIALLY_SUPPORTS"), pos("A", "q3", "OPPOSES"),
      pos("B", "q1", "OPPOSES"), pos("B", "q2", "SUPPORTS"), pos("B", "q3", "OPPOSES"),
    ];
    expect(themeProximity(qs, answers, cands, positions).closestCandidateId).toBe("A");
  });
});
