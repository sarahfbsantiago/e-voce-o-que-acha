import { describe, expect, it } from "vitest";
import * as mod from "@/domain/theme-proximity";
import { QUESTIONS } from "@/data/questions";
import type { Candidate } from "@/domain/types";

/** Candidatos fictícios: estes testes verificam a regra padrão, sem a tabela de notas revisadas dos candidatos reais. */
const CANDIDATES = [{ id: "cand-a", name: "Candidato A" }, { id: "cand-b", name: "Candidato B" }] as unknown as Candidate[];
import type { CandidatePosition } from "@/domain/types";

const qs = QUESTIONS.filter((q) => q.topicId === "t01");
const pos = (candidateId: string, questionId: string, direction: CandidatePosition["direction"]): CandidatePosition => ({
  id: `${candidateId}-${questionId}`, candidateId, questionId, direction, closestOptionId: null, summary: "", evidenceIds: ["e"], reviewStatus: "PUBLISHED", updatedAt: "x",
});
const answers = [{ questionId: "q01", optionIds: ["q01-o1"] }, { questionId: "q02", optionIds: ["q02-o1"] }];

describe("proximidade documentada por tema", () => {
  it("sem posições publicadas → evidência insuficiente", () => {
    const r = mod.themeProximity(qs, answers, CANDIDATES, []);
    expect(r.closestCandidateId).toBeNull();
    expect(r.reason).toBe("INSUFFICIENT_EVIDENCE");
  });
  it("só um candidato documentado → o silêncio do outro conta como diferente, e o documentado fica mais próximo", () => {
    const r = mod.themeProximity(qs, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS")]);
    expect(r.closestCandidateId).toBe("cand-a");
    expect(r.counts.find((c) => c.candidateId === "cand-a")).toMatchObject({ documented: 1, silent: 1, similar: 1 });
    expect(r.counts.find((c) => c.candidateId === "cand-b")).toMatchObject({ documented: 0, silent: 2 });
  });
  it("silêncio nunca vira posição: só rebaixa a proporção de quem não se posicionou", () => {
    // Lula concorda em q01 e se cala em q02; Flávio concorda nas duas → Flávio fica mais próximo.
    const r = mod.themeProximity(qs, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q01", "SUPPORTS"), pos("cand-b", "q02", "SUPPORTS")]);
    expect(r.closestCandidateId).toBe("cand-b");
  });
  it("ambos documentados → indica o mais próximo, com contagem transparente", () => {
    const r = mod.themeProximity(qs, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q01", "OPPOSES")]);
    expect(r.closestCandidateId).toBe("cand-a");
    expect(r.counts.find((c) => c.candidateId === "cand-a")).toMatchObject({ documented: 1, similar: 1 });
  });
  it("empate → nenhum indicado", () => {
    const r = mod.themeProximity(qs, answers, CANDIDATES, [pos("cand-a", "q01", "SUPPORTS"), pos("cand-b", "q01", "SUPPORTS")]);
    expect(r.closestCandidateId).toBeNull();
    expect(r.reason).toBe("TIE");
  });
  it("posições não publicadas são ignoradas", () => {
    const draft = { ...pos("cand-a", "q01", "SUPPORTS"), reviewStatus: "APPROVED" as const };
    expect(mod.themeProximity(qs, answers, CANDIDATES, [draft]).reason).toBe("INSUFFICIENT_EVIDENCE");
  });
  it("o módulo não exporta nenhuma função que some temas em resultado geral", () => {
    expect(Object.keys(mod).sort()).toEqual(["MIN_DOCUMENTED_PER_CANDIDATE", "describeProximity", "themeProximity"]);
  });
});
