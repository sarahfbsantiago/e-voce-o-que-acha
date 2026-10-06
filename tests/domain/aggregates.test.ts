import { describe, expect, it } from "vitest";
import * as agg from "@/domain/aggregates";
import { QUESTION_BY_ID } from "@/data/questions";

const sub = (i: number, optionId: string, age: agg.SubmissionLike["optionalAgeRange"] = null): agg.SubmissionLike => ({
  id: String(i), submittedAt: "2026-10-06T10:00:00Z", methodologyVersion: "1.0.0", answers: [{ questionId: "q01", optionIds: [optionId] }], topicPriorities: [{ topicId: "t01", level: 4 }], optionalAgeRange: age, optionalRegion: null,
});

describe("agregação anônima", () => {
  it("conta respostas por alternativa como % das respostas", () => {
    const q = QUESTION_BY_ID.q01;
    const subs = [sub(1, "q01-o1"), sub(2, "q01-o1"), sub(3, "q01-o4"), sub(4, "q01-o5")];
    const a = agg.aggregateQuestion("q01", q.options.map((o) => o.id), subs);
    expect(a.totalResponses).toBe(4);
    expect(a.options.find((o) => o.optionId === "q01-o1")?.shareOfResponses).toBe(50);
    expect(agg.formatShare(50)).toBe("50% das respostas");
  });
  it("suprime grupos menores que MIN_AGGREGATE_GROUP_SIZE", () => {
    const subs = [...Array(12)].map((_, i) => sub(i, "q01-o1", i < 10 ? "25-34" : "60+"));
    const d = agg.demographicDistribution(subs.map((s) => s.optionalAgeRange));
    expect(d["25-34"]).toBe(10);
    expect(d["60+"]).toBeNull();
    expect(agg.MIN_AGGREGATE_GROUP_SIZE).toBe(10);
  });
  it("não exporta nenhuma função de intenção de voto, projeção ou vencedor", () => {
    const names = Object.keys(agg).join(" ").toLowerCase();
    for (const bad of ["vote", "voto", "winner", "vencedor", "projection", "projecao", "recommend", "recomend"]) expect(names).not.toContain(bad);
  });
  it("agrega avaliação da pesquisa sem identificar pessoas", () => {
    const f = agg.aggregateFeedback([
      { id: "a", submittedAt: "x", methodologyVersion: "1.0.0", rating: 5, helpedDecision: true },
      { id: "b", submittedAt: "x", methodologyVersion: "1.0.0", rating: 3, helpedDecision: false },
      { id: "c", submittedAt: "x", methodologyVersion: "1.0.0", rating: 4, helpedDecision: null },
    ]);
    expect(f.total).toBe(3);
    expect(f.averageRating).toBe(4);
    expect(f.shareHelpedYes).toBe(50);
  });
});
