import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { CONTEXT_NOTES } from "@/data/context-notes";
import { ARGUMENT_SET_BY_ID } from "@/data/arguments";
import { SOURCE_BY_ID, SOURCE_REGISTRY } from "@/data/source-registry";
import { RESEARCH_PROTOCOLS } from "@/data/research-protocols";
import { METHODOLOGY_VERSIONS } from "@/data/methodology";
import { CANDIDATES } from "@/data/candidates";
import { CANDIDATE_PROFILES, EXPERIENCE_ROWS } from "@/data/candidate-profiles";
import { findForbiddenPhrases } from "@/domain/neutrality";

describe("integridade dos dados", () => {
  it("ids únicos", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const optIds = QUESTIONS.flatMap((q) => q.options.map((o) => o.id));
    expect(new Set(optIds).size).toBe(optIds.length);
    expect(new Set(SOURCE_REGISTRY.map((s) => s.id)).size).toBe(SOURCE_REGISTRY.length);
  });
  it("toda pergunta pertence a um tema, tem alternativas e 'Não sei'", () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));
    for (const q of QUESTIONS) {
      expect(topicIds.has(q.topicId), q.id).toBe(true);
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
      expect(q.options.some((o) => o.isNoOpinion), q.id).toBe(true);
    }
  });
  it("46 perguntas e 12 temas", () => {
    expect(QUESTIONS.length).toBe(46);
    expect(TOPICS.length).toBe(12);
  });
  it("notas de contexto, argumentos e protocolos referenciados existem", () => {
    const noteIds = new Set(CONTEXT_NOTES.map((n) => n.id));
    const protocolQ = new Set(RESEARCH_PROTOCOLS.map((p) => p.questionId));
    for (const q of QUESTIONS) {
      for (const id of q.contextNoteIds ?? []) expect(noteIds.has(id), id).toBe(true);
      if (q.argumentsId) expect(ARGUMENT_SET_BY_ID[q.argumentsId], q.argumentsId).toBeDefined();
      expect(protocolQ.has(q.id), q.id).toBe(true);
    }
  });
  it("toda fonte citada em notas, protocolos e candidatos está no registro", () => {
    for (const n of CONTEXT_NOTES) {
      for (const id of n.sourceIds) expect(SOURCE_BY_ID[id], id).toBeDefined();
      for (const ev of n.timeline ?? []) expect(SOURCE_BY_ID[ev.sourceId], ev.sourceId).toBeDefined();
    }
    for (const p of RESEARCH_PROTOCOLS) for (const id of p.sourceIds) expect(SOURCE_BY_ID[id], id).toBeDefined();
    for (const c of CANDIDATES) for (const id of c.historySourceIds) expect(SOURCE_BY_ID[id], id).toBeDefined();
  });
  it("toda fonte tem URL e status de verificação", () => {
    for (const s of SOURCE_REGISTRY) {
      expect(s.url.startsWith("https://"), s.id).toBe(true);
      expect(["VERIFIED", "PENDING_MANUAL", "UNVERIFIED"]).toContain(s.verification.status);
    }
  });
  it("notas legais trazem fonte jurídica e data de vigência", () => {
    for (const n of CONTEXT_NOTES.filter((n) => n.kind === "LEGAL")) {
      expect(n.sourceIds.length, n.id).toBeGreaterThan(0);
      expect(n.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("nenhum texto de pergunta, nota ou argumento contém linguagem de recomendação", () => {
    const texts = [...QUESTIONS.map((q) => q.text), ...CONTEXT_NOTES.flatMap((n) => n.paragraphs), ...Object.values(ARGUMENT_SET_BY_ID).flatMap((a) => [...a.inFavor, ...a.against])];
    for (const t of texts) expect(findForbiddenPhrases(t)).toEqual([]);
  });
  it("toda sessão tem pergunta de importância própria", () => {
    for (const t of TOPICS) expect(t.priorityQuestion, t.id).toMatch(/importa/i);
  });
  it("perfis dos candidatos: um por candidato, toda afirmação com fonte registrada, tabela com os mesmos critérios", () => {
    expect(CANDIDATE_PROFILES.map((p) => p.candidateId).sort()).toEqual(CANDIDATES.map((c) => c.id).sort());
    for (const p of CANDIDATE_PROFILES) {
      const facts = [p.shortBio, ...p.timeline, ...p.governmentExperience];
      for (const f of facts) {
        expect(f.sourceIds.length, f.text).toBeGreaterThan(0);
        for (const id of f.sourceIds) expect(SOURCE_BY_ID[id], id).toBeDefined();
      }
      for (const pos of p.positionsHeld) for (const id of pos.sourceIds) expect(SOURCE_BY_ID[id], id).toBeDefined();
      for (const l of p.officialLinks) expect(SOURCE_BY_ID[l.sourceId], l.sourceId).toBeDefined();
      expect(findForbiddenPhrases(p.shortBio.text)).toEqual([]);
    }
    for (const row of EXPERIENCE_ROWS) expect(Object.keys(row.byCandidate).sort()).toEqual(CANDIDATES.map((c) => c.id).sort());
  });
  it("histórico de metodologia mantém todas as versões e exatamente uma vigente", () => {
    expect(METHODOLOGY_VERSIONS.length).toBeGreaterThanOrEqual(2);
    expect(METHODOLOGY_VERSIONS.filter((v) => v.effectiveUntil === null).length).toBe(1);
  });
});
