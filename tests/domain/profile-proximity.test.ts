import { describe, expect, it } from "vitest";
import { aggregateProfileProximity, profileProximity } from "@/domain/profile-proximity";
import { QUESTIONS } from "@/data/questions";
import type { Candidate } from "@/domain/types";

/** Candidatos fictícios: estes testes verificam a regra padrão, sem a tabela de notas revisadas dos candidatos reais. */
const CANDIDATES = [{ id: "cand-a", name: "Candidato A" }, { id: "cand-b", name: "Candidato B" }] as unknown as Candidate[];
import type { CandidatePosition } from "@/domain/types";

const pos = (candidateId: string, questionId: string, direction: CandidatePosition["direction"]): CandidatePosition => ({
  id: `${candidateId}-${questionId}`, candidateId, questionId, direction, closestOptionId: null, summary: "", evidenceIds: ["e"], reviewStatus: "PUBLISHED", updatedAt: "x",
});
// q01 e q03 são do tema t01; q05 é de outro tema.
const answers = [{ questionId: "q01", optionIds: ["q01-o1"] }, { questionId: "q03", optionIds: ["q03-o1"] }, { questionId: "q05", optionIds: ["q05-o1"] }];

describe("perfil mais próximo (conta aberta do relatório, em forma pura)", () => {
  it("sem posições publicadas → sem comparação", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, []);
    expect(r.closestCandidateId).toBeNull();
    expect(r.reason).toBe("NO_COMPARISON");
  });
  it("conta temas: quem ficou mais perto em mais temas é o mais próximo do perfil", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q01", "OPPOSES"), pos("cand-a", "q05", "SUPPORTS")]);
    expect(r.decidedThemes).toBe(2);
    expect(r.closestCandidateId).toBe("cand-a");
    const lula = r.totals.find((t) => t.candidateId === "cand-a")!;
    expect(lula).toMatchObject({ themes: 2, documented: 2, silent: 1, similar: 2 });
    expect(lula.agreement).toBeCloseTo((2 / 3) * 100);
  });
  it("empate em temas → ninguém indicado", () => {
    const r = profileProximity(QUESTIONS, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q05", "SUPPORTS")]);
    expect(r.reason).toBe("TIE");
    expect(r.closestCandidateId).toBeNull();
  });
  it("agrega questionários em contagens e proporções, sem registro individual", () => {
    const positions = [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q01", "OPPOSES")];
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
    expect(a.byCandidate.find((b) => b.candidateId === "cand-a")).toMatchObject({ count: 2, share: 66.7 });
    expect(a.byCandidate.find((b) => b.candidateId === "cand-b")).toMatchObject({ count: 1, share: 33.3 });
    expect(Object.keys(a).sort()).toEqual(["byCandidate", "noComparison", "ties", "total", "withComparison"]);
  });
});
