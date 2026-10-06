import { describe, expect, it } from "vitest";
import { aggregateProfileProximity, profileProximity } from "@/domain/profile-proximity";
import { QUESTIONS } from "@/data/questions";
import { CANDIDATES } from "@/data/candidates";
import type { CandidatePosition } from "@/domain/types";

const pos = (candidateId: string, questionId: string, direction: CandidatePosition["direction"]): CandidatePosition => ({
  id: `${candidateId}-${questionId}`, candidateId, questionId, direction, closestOptionId: null, summary: "", evidenceIds: ["e"], reviewStatus: "PUBLISHED", updatedAt: "x",
});
// q01 e q02 são do tema t01; q05 é de outro tema.
const answers = [{ questionId: "q01", optionIds: ["q01-o1"] }, { questionId: "q02", optionIds: ["q02-o1"] }, { questionId: "q05", optionIds: ["q05-o1"] }];

describe("perfil mais próximo (conta aberta do relatório, em forma pura)", () => {
  it("sem posições publicadas → sem comparação", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, []);
    expect(r.closestCandidateId).toBeNull();
    expect(r.reason).toBe("NO_COMPARISON");
  });
  it("conta temas: quem ficou mais perto em mais temas é o mais próximo do perfil", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, [pos("lula", "q01", "SUPPORTS"), pos("flavio-bolsonaro", "q01", "OPPOSES"), pos("lula", "q05", "SUPPORTS")]);
    expect(r.decidedThemes).toBe(2);
    expect(r.closestCandidateId).toBe("lula");
    const lula = r.totals.find((t) => t.candidateId === "lula")!;
    expect(lula).toMatchObject({ themes: 2, documented: 2, silent: 1, similar: 2 });
    expect(lula.agreement).toBeCloseTo((2 / 3) * 100);
  });
  it("empate em temas → ninguém indicado", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, [pos("lula", "q01", "SUPPORTS"), pos("flavio-bolsonaro", "q05", "SUPPORTS")]);
    expect(r.reason).toBe("TIE");
    expect(r.closestCandidateId).toBeNull();
  });
  it("agrega questionários em contagens e proporções, sem registro individual", () => {
    const positions = [pos("lula", "q01", "SUPPORTS"), pos("flavio-bolsonaro", "q01", "OPPOSES")];
    const subs = [
      { answers: [{ questionId: "q01", optionIds: ["q01-o1"] }] }, // perto de Lula
      { answers: [{ questionId: "q01", optionIds: ["q01-o1"] }] }, // perto de Lula
      { answers: [{ questionId: "q01", optionIds: ["q01-o4"] }] }, // perto de Flávio
      { answers: [{ questionId: "q07", optionIds: ["q07-o1"] }] }, // sem comparação
    ];
    const a = aggregateProfileProximity(subs, QUESTIONS, CANDIDATES, positions);
    expect(a.total).toBe(4);
    expect(a.noComparison).toBe(1);
    expect(a.withComparison).toBe(3);
    expect(a.byCandidate.find((b) => b.candidateId === "lula")).toMatchObject({ count: 2, share: 66.7 });
    expect(a.byCandidate.find((b) => b.candidateId === "flavio-bolsonaro")).toMatchObject({ count: 1, share: 33.3 });
    expect(Object.keys(a).sort()).toEqual(["byCandidate", "noComparison", "ties", "total", "withComparison"]);
  });
});
