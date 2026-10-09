import { describe, expect, it } from "vitest";
import * as comparison from "@/domain/comparison";
import { QUESTION_BY_ID } from "@/data/questions";
import type { CandidatePosition } from "@/domain/types";

const pos = (over: Partial<CandidatePosition>): CandidatePosition => ({
  id: "p1", candidateId: "x", questionId: "q01", direction: "SUPPORTS", closestOptionId: null, summary: "", evidenceIds: ["e1"], reviewStatus: "PUBLISHED", updatedAt: "2026-10-06", ...over,
});

describe("indicador por questão", () => {
  // q01: Concordo (o1, +2) · Concordo em parte (o2, +1) · Discordo em parte (o3, −1) · Discordo (o4, −2) · Não sei (o5)
  const q01 = QUESTION_BY_ID.q01;
  it("sem posição publicada → evidência insuficiente", () => {
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, null)).toBe("INSUFFICIENT_EVIDENCE");
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, pos({ reviewStatus: "APPROVED" }))).toBe("INSUFFICIENT_EVIDENCE");
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, pos({ direction: "UNCLEAR" }))).toBe("INSUFFICIENT_EVIDENCE");
  });
  it("usuário marcou 'Não sei' → sem comparação", () => {
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o5"] }, pos({}))).toBeNull();
  });
  it("escala ordinal: semelhante, parcial, diferente", () => {
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, pos({ direction: "SUPPORTS" }))).toBe("SIMILAR");
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, pos({ direction: "PARTIALLY_SUPPORTS" }))).toBe("PARTIALLY_SIMILAR");
    expect(comparison.compareAnswerToPosition(q01, { questionId: "q01", optionIds: ["q01-o1"] }, pos({ direction: "OPPOSES" }))).toBe("DIFFERENT");
  });
  it("alternativas sem escala usam a alternativa mais próxima documentada", () => {
    // q20: auxílio (o1) · empregos (o2) · salários (o3) · educação (o4) · todas (o5) · Não sei (o6)
    const q20 = QUESTION_BY_ID.q20;
    const p = pos({ questionId: "q20", closestOptionId: "q20-o2" });
    expect(comparison.compareAnswerToPosition(q20, { questionId: "q20", optionIds: ["q20-o2"] }, p)).toBe("SIMILAR");
    expect(comparison.compareAnswerToPosition(q20, { questionId: "q20", optionIds: ["q20-o1"] }, p)).toBe("PARTIALLY_SIMILAR");
    expect(comparison.compareAnswerToPosition(q20, { questionId: "q20", optionIds: ["q20-o5"] }, p)).toBe("DIFFERENT");
    expect(comparison.compareAnswerToPosition(q20, { questionId: "q20", optionIds: ["q20-o1"] }, pos({ questionId: "q20", closestOptionId: null }))).toBe("INSUFFICIENT_EVIDENCE");
  });
  it("múltipla escolha: semelhante se a alternativa documentada está entre as marcadas", () => {
    const multi = { ...QUESTION_BY_ID.q20, kind: "MULTI_CHOICE" as const };
    expect(comparison.compareAnswerToPosition(multi, { questionId: "q20", optionIds: ["q20-o1", "q20-o4"] }, pos({ questionId: "q20", closestOptionId: "q20-o4" }))).toBe("SIMILAR");
  });
  it("o módulo não exporta nenhuma função de agregação ou ranking", () => {
    expect(Object.keys(comparison).sort()).toEqual(["compareAnswerToPosition", "hasOptionScores", "optionScore", "reviewedOptionScore", "ruleOptionScore"]);
  });
});

describe("notas revisadas por alternativa (mesma tabela do admin)", () => {
  const q05 = QUESTION_BY_ID.q05;
  const q53 = QUESTION_BY_ID.q53;
  it("valem antes da regra padrão", () => {
    const p = pos({ candidateId: "flavio-bolsonaro", questionId: "q05", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q05-o2" });
    expect(comparison.compareAnswerToPosition(q05, { questionId: "q05", optionIds: ["q05-o3"] }, p)).toBe("SIMILAR");
    expect(comparison.compareAnswerToPosition(q05, { questionId: "q05", optionIds: ["q05-o2"] }, p)).toBe("DIFFERENT");
  });
  it("funcionam mesmo sem posição publicada", () => {
    expect(comparison.compareAnswerToPosition(q53, { questionId: "q53", optionIds: ["q53-o3"] }, null, "flavio-bolsonaro")).toBe("PARTIALLY_SIMILAR");
    expect(comparison.compareAnswerToPosition(q53, { questionId: "q53", optionIds: ["q53-o2"] }, null, "flavio-bolsonaro")).toBe("DIFFERENT");
  });
  it("\"Não sei\" continua fora da conta", () => {
    expect(comparison.compareAnswerToPosition(q05, { questionId: "q05", optionIds: ["q05-o4"] }, null, "flavio-bolsonaro")).toBeNull();
  });
});
