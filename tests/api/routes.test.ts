import { describe, expect, it } from "vitest";
import { GET as getQuestions } from "@/app/api/questions/route";
import { GET as getQuestion } from "@/app/api/questions/[id]/route";
import { GET as getEvidence } from "@/app/api/questions/[id]/evidence/route";
import { GET as getTopics } from "@/app/api/topics/route";
import { GET as getCandidates } from "@/app/api/candidates/route";
import { GET as getCandidate } from "@/app/api/candidates/[id]/route";
import { GET as getPositions } from "@/app/api/candidates/[id]/positions/route";
import { GET as getSources } from "@/app/api/sources/route";
import { GET as getSource } from "@/app/api/sources/[id]/route";
import { GET as getMethodology } from "@/app/api/methodology/route";
import { GET as getHistory } from "@/app/api/methodology/history/route";
import { GET as getProtocols } from "@/app/api/research/protocols/route";
import { NO_EVIDENCE_MESSAGE } from "@/domain/types";

const req = (path: string) => new Request(`http://localhost${path}`);
const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("API pública (modo estático)", () => {
  it("GET /api/questions", async () => {
    const body = await (await getQuestions()).json();
    expect(body.questions).toHaveLength(25);
    expect(body.topics).toHaveLength(12);
  });
  it("GET /api/questions/[id] inclui contexto, argumentos e protocolo", async () => {
    const body = await (await getQuestion(req("/api/questions/q28"), params("q28"))).json();
    expect(body.question.id).toBe("q28");
    expect(body.contextNotes[0].id).toBe("ctx-apostas-2026");
    expect(body.researchProtocol.questionId).toBe("q28");
    expect((await getQuestion(req("/x"), params("nope"))).status).toBe(404);
  });
  it("GET /api/questions/[id]/evidence devolve estado explícito de ausência", async () => {
    const body = await (await getEvidence(req("/x"), params("q01"))).json();
    expect(body.candidates).toHaveLength(2);
    for (const c of body.candidates) {
      expect(c.status).toBe("INSUFFICIENT_EVIDENCE");
      expect(c.message).toBe(NO_EVIDENCE_MESSAGE);
    }
    // Nenhum campo de pontuação ou vencedor
    expect(JSON.stringify(body)).not.toMatch(/score|winner|recommend/i);
  });
  it("GET /api/topics, /api/candidates, /api/candidates/[id]", async () => {
    expect((await (await getTopics()).json()).topics).toHaveLength(12);
    const c = await (await getCandidates()).json();
    expect(c.candidates.map((x: { id: string }) => x.id).sort()).toEqual(["flavio-bolsonaro", "lula"]);
    const one = await (await getCandidate(req("/x"), params("lula"))).json();
    expect(one.candidate.name).toBe("Lula");
    expect(one.historySources.length).toBeGreaterThan(0);
  });
  it("GET /api/candidates/[id]/positions não calcula nada: só itens por pergunta", async () => {
    const body = await (await getPositions(req("/x"), params("flavio-bolsonaro"))).json();
    expect(body.items).toHaveLength(25);
    expect(body.items.every((i: { status: string }) => i.status === "INSUFFICIENT_EVIDENCE")).toBe(true);
    expect(Object.keys(body)).toEqual(["candidateId", "items"]);
  });
  it("GET /api/sources com filtros e /api/sources/[id]", async () => {
    const all = await (await getSources(req("/api/sources"))).json();
    expect(all.sources.length).toBeGreaterThan(30);
    const legis = await (await getSources(req("/api/sources?type=legislation"))).json();
    expect(legis.sources.every((s: { type: string }) => s.type === "legislation")).toBe(true);
    const one = await (await getSource(req("/x"), params("mpv-1394-2026"))).json();
    expect(one.source.url).toContain("planalto.gov.br");
  });
  it("GET /api/methodology e /history mantêm versões anteriores acessíveis", async () => {
    const m = await (await getMethodology()).json();
    expect(m.current.version).toBe("1.3.0");
    const h = await (await getHistory()).json();
    expect(h.versions.length).toBeGreaterThanOrEqual(3);
    expect(h.versions.find((v: { version: string }) => v.version === "1.1.0")).toBeDefined();
    expect(h.versions.find((v: { version: string }) => v.version === "1.0.0")).toBeDefined();
  });
  it("GET /api/research/protocols filtra por pergunta", async () => {
    const p = await (await getProtocols(req("/api/research/protocols?questionId=q25"))).json();
    expect(p.protocols).toHaveLength(1);
    expect(p.protocols[0].searchTerms).toContain("Estatuto do Desarmamento");
  });
});
