import { describe, expect, it } from "vitest";
import { canPublishEvidence, canPublishPosition, hasAutomaticCausalClaim, isPubliclyVisible, validateIndicator } from "@/domain/publication";
import { SOURCE_BY_ID } from "@/data/source-registry";
import type { CandidatePosition, Evidence, Indicator } from "@/domain/types";

const evidence = (over: Partial<Evidence> = {}): Evidence => ({
  id: "e1", candidateId: "lula", questionId: "q01", topicId: "t01", title: "t", summary: "s", originalExcerpt: "trecho", sourceId: "lei-15270-2025", sourceType: "legislation",
  eventDate: "2025-11-26", publicationDate: "2025-11-26", retrievedAt: "2026-10-06", classification: "ATUACAO", evidenceStrength: "A", reviewStatus: "APPROVED", createdAt: "x", updatedAt: "x", ...over,
});

describe("publicação de evidência", () => {
  it("exige fonte registrada", () => {
    expect(canPublishEvidence(evidence(), undefined).ok).toBe(false);
    expect(canPublishEvidence(evidence(), SOURCE_BY_ID["lei-15270-2025"]).ok).toBe(true);
  });
  it("exige revisão aprovada", () => {
    expect(canPublishEvidence(evidence({ reviewStatus: "DRAFT" }), SOURCE_BY_ID["lei-15270-2025"]).ok).toBe(false);
    expect(canPublishEvidence(evidence({ reviewStatus: "PENDING_REVIEW" }), SOURCE_BY_ID["lei-15270-2025"]).ok).toBe(false);
    expect(canPublishEvidence(evidence({ reviewStatus: "REJECTED" }), SOURCE_BY_ID["lei-15270-2025"]).ok).toBe(false);
  });
  it("evidência rejeitada ou não revisada não é publicamente visível", () => {
    expect(isPubliclyVisible("REJECTED")).toBe(false);
    expect(isPubliclyVisible("DRAFT")).toBe(false);
    expect(isPubliclyVisible("APPROVED")).toBe(false);
    expect(isPubliclyVisible("PUBLISHED")).toBe(true);
  });
});

describe("publicação de posição", () => {
  const position: CandidatePosition = { id: "p", candidateId: "lula", questionId: "q01", direction: "SUPPORTS", closestOptionId: null, summary: "Defende X", evidenceIds: ["e1"], reviewStatus: "APPROVED", updatedAt: "x" };
  it("não pode ser publicada sem evidência aprovada", () => {
    expect(canPublishPosition(position, []).ok).toBe(false);
    expect(canPublishPosition(position, [evidence({ reviewStatus: "DRAFT" })]).ok).toBe(false);
    expect(canPublishPosition(position, [evidence()]).ok).toBe(true);
  });
  it("não pode depender só de fontes de nível D", () => {
    expect(canPublishPosition(position, [evidence({ evidenceStrength: "D" })]).ok).toBe(false);
    expect(canPublishPosition({ ...position, evidenceIds: ["e1", "e2"] }, [evidence({ evidenceStrength: "D" }), evidence({ id: "e2", evidenceStrength: "B" })]).ok).toBe(true);
  });
  it("rejeita linguagem de recomendação no resumo", () => {
    expect(canPublishPosition({ ...position, summary: "Este é o melhor candidato para o tema" }, [evidence()]).ok).toBe(false);
  });
});

describe("indicadores estatísticos", () => {
  const ind: Indicator = { id: "i", name: "Desemprego", surveyName: "PNAD Contínua", institution: "IBGE", sourceId: "ibge", value: 7.1, unit: "%", referencePeriod: "trimestre móvel", releasedAt: "2026-01-30", reviewStatus: "APPROVED" };
  it("exigem período de referência", () => {
    expect(validateIndicator(ind).ok).toBe(true);
    expect(validateIndicator({ ...ind, referencePeriod: "" }).ok).toBe(false);
  });
  it("detectam afirmação causal automática", () => {
    expect(hasAutomaticCausalClaim("O presidente reduziu o desemprego de X para Y.")).toBe(true);
    expect(hasAutomaticCausalClaim("A taxa de desemprego passou de X para Y durante o período.")).toBe(false);
  });
});
