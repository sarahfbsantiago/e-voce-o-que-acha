/**
 * Importa rascunhos (DRAFT) para revisão humana.
 *
 * - prisma/drafts/program-summaries.draft.json → ProgramSummary (reviewStatus DRAFT)
 * - docs/levantamentos/*-flavio-bolsonaro-projetos-autor-principal-senado.csv → LegislativeAction (DRAFT)
 * - prisma/drafts/positions.draft.json → CandidatePosition + Evidence (DRAFT), ligados entre si
 *
 * Nada aqui é publicado. Para publicar, um revisor muda reviewStatus para
 * APPROVED e depois PUBLISHED (ex.: via `npm run db:studio`), registrando AuditLog.
 */
import { Prisma, PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { QUESTION_BY_ID } from "../src/data/questions";
import { SOURCE_BY_ID } from "../src/data/source-registry";

const prisma = new PrismaClient();

interface DraftSummary {
  candidateId: string;
  themeKey: string;
  actionLabel: "MANTER" | "AMPLIAR" | "CRIAR" | "MUDAR" | "REDUZIR" | "SEM_PROPOSTA_CLARA";
  title: string;
  summary: string;
  pages: number[];
  excerpt: string;
  proposalDetails?: Record<string, string>;
}

async function importProgramSummaries() {
  const file = JSON.parse(readFileSync(join(__dirname, "drafts", "program-summaries.draft.json"), "utf8")) as {
    _meta: { sources: Record<string, string>; documentDate: string };
    summaries: DraftSummary[];
  };
  let n = 0;
  for (const d of file.summaries) {
    const sourceId = file._meta.sources[d.candidateId];
    const existing = await prisma.programSummary.findFirst({ where: { candidateId: d.candidateId, themeKey: d.themeKey, title: d.title } });
    const data = {
      candidateId: d.candidateId,
      themeKey: d.themeKey,
      title: d.title,
      summary: d.summary,
      documentalStatus: `Programa de governo registrado no TSE (PDF, páginas ${d.pages.join(", ")}). Trecho: “${d.excerpt}”`,
      actionLabel: d.actionLabel,
      sourceId,
      documentDate: new Date(file._meta.documentDate),
      proposalDetails: (d.proposalDetails ?? {}) as Prisma.InputJsonValue,
      // resumo já revisado mantém o status; só rascunhos ficam como DRAFT
      reviewStatus: existing && existing.reviewStatus !== "DRAFT" ? existing.reviewStatus : ("DRAFT" as const),
    };
    if (existing) await prisma.programSummary.update({ where: { id: existing.id }, data });
    else await prisma.programSummary.create({ data });
    n++;
  }
  return n;
}

async function importLegislativeActions() {
  const dir = join(__dirname, "..", "docs", "levantamentos");
  const csv = readdirSync(dir).find((f) => f.includes("flavio-bolsonaro-projetos-autor-principal-senado"));
  if (!csv) return 0;
  const lines = readFileSync(join(dir, csv), "utf8").trim().split("\n").slice(1);
  let n = 0;
  for (const line of lines) {
    // sigla,numero,ano,data,codigo_materia,link,ementa (ementa entre aspas)
    const m = line.match(/^([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),"(.*)"$/);
    if (!m) continue;
    const [, sigla, numero, ano, data, codigo, link, ementaRaw] = m;
    const ementa = ementaRaw.replaceAll('""', '"');
    const externalId = `senado:${codigo}`;
    const existing = await prisma.legislativeAction.findFirst({ where: { candidateId: "flavio-bolsonaro", externalId } });
    const payload = {
      candidateId: "flavio-bolsonaro",
      kind: "projeto (autor principal)",
      externalId,
      title: `${sigla} ${numero}/${ano}`,
      summary: `${ementa} — Situação de tramitação a conferir em ${link}`,
      date: data ? new Date(data) : null,
      sourceId: "senado-dados-abertos-flavio-bolsonaro",
      reviewStatus: "DRAFT" as const,
    };
    if (existing) await prisma.legislativeAction.update({ where: { id: existing.id }, data: payload });
    else await prisma.legislativeAction.create({ data: payload });
    n++;
  }
  return n;
}

interface DraftEvidence {
  classification: "PROPOSTA" | "POSICAO" | "ATUACAO" | "RESULTADO_OBSERVADO";
  strength: "A" | "B" | "C" | "D";
  title: string;
  summary: string;
  excerpt: string;
  sourceId: string;
  url?: string;
  pages?: number[];
  date?: string;
  inForce?: boolean | null;
}
interface DraftPosition {
  candidateId: string;
  questionId: string;
  direction: "SUPPORTS" | "PARTIALLY_SUPPORTS" | "NEUTRAL" | "PARTIALLY_OPPOSES" | "OPPOSES" | "UNCLEAR";
  closestOption: number | null;
  summary: string;
  evidence: DraftEvidence[];
  timeline?: { date: string; text: string }[];
}

/** Com IMPORT_UPDATE_PUBLISHED=1, posições já publicadas também são atualizadas (e continuam publicadas). */
const UPDATE_PUBLISHED = process.env.IMPORT_UPDATE_PUBLISHED === "1";

/** Posições por pergunta com evidências, tudo em DRAFT. Reimportar atualiza o rascunho sem tocar no que já foi revisado. */
async function importPositions() {
  const file = JSON.parse(readFileSync(join(__dirname, "drafts", "positions.draft.json"), "utf8")) as { _meta: { criterion: string }; positions: DraftPosition[] };
  let n = 0, e = 0, skipped = 0;
  for (const d of file.positions) {
    const q = QUESTION_BY_ID[d.questionId];
    if (!q) continue;
    const existing = await prisma.candidatePosition.findFirst({ where: { candidateId: d.candidateId, questionId: d.questionId } });
    if (existing && existing.reviewStatus !== "DRAFT" && !(UPDATE_PUBLISHED && existing.reviewStatus === "PUBLISHED")) { skipped++; continue; }
    const status = existing?.reviewStatus === "PUBLISHED" && UPDATE_PUBLISHED ? ("PUBLISHED" as const) : ("DRAFT" as const);
    const evidenceIds: string[] = [];
    for (const ev of d.evidence) {
      const src = SOURCE_BY_ID[ev.sourceId];
      if (!src) throw new Error(`fonte desconhecida: ${ev.sourceId}`);
      const found = await prisma.evidence.findFirst({ where: { candidateId: d.candidateId, questionId: d.questionId, title: ev.title } });
      const data = {
        candidateId: d.candidateId,
        questionId: d.questionId,
        topicId: q.topicId,
        title: ev.title,
        summary: ev.url ? `${ev.summary} Documento: ${ev.url}` : ev.pages?.length ? `${ev.summary} (PDF, páginas ${ev.pages.join(", ")})` : ev.summary,
        originalExcerpt: ev.excerpt,
        sourceId: ev.sourceId,
        sourceType: src.type,
        eventDate: ev.date ? new Date(ev.date) : null,
        publicationDate: ev.date ? new Date(ev.date) : null,
        retrievedAt: new Date("2026-10-06"),
        classification: ev.classification,
        evidenceStrength: ev.strength,
        classificationCriterion: file._meta.criterion,
        inForce: ev.inForce ?? null,
        reviewStatus: status,
      };
      const row = found && (found.reviewStatus === "DRAFT" || UPDATE_PUBLISHED) ? await prisma.evidence.update({ where: { id: found.id }, data }) : found ?? (await prisma.evidence.create({ data }));
      evidenceIds.push(row.id);
      e++;
    }
    const closestOptionId = d.closestOption ? `${d.questionId}-o${d.closestOption}` : null;
    const payload = { candidateId: d.candidateId, questionId: d.questionId, direction: d.direction, closestOptionId, summary: d.summary, reviewStatus: status, timeline: d.timeline ? (d.timeline as unknown as Prisma.InputJsonValue) : Prisma.JsonNull };
    const pos = existing ? await prisma.candidatePosition.update({ where: { id: existing.id }, data: payload }) : await prisma.candidatePosition.create({ data: payload });
    await prisma.candidatePositionEvidence.deleteMany({ where: { positionId: pos.id } });
    if (evidenceIds.length) await prisma.candidatePositionEvidence.createMany({ data: evidenceIds.map((id) => ({ positionId: pos.id, evidenceId: id })) });
    n++;
  }
  return { n, e, skipped };
}

async function main() {
  const a = await importProgramSummaries();
  const b = await importLegislativeActions();
  const c = await importPositions();
  await prisma.auditLog.create({
    data: {
      actor: "import-drafts",
      operation: "IMPORT_DRAFTS",
      entity: "ProgramSummary/LegislativeAction",
      entityId: "batch-2026-10-06",
      reason: `Importados ${a} resumos de programa, ${b} atuações legislativas e ${c.n} posições por pergunta (${c.e} evidências) como DRAFT, a partir de documentos oficiais (TSE, Senado, Câmara, Planalto). ${c.skipped} posições já revisadas foram preservadas. Nenhum item publicado.`,
    },
  });
  console.log(`Rascunhos importados: ${a} resumos de programa, ${b} atuações legislativas, ${c.n} posições (${c.e} evidências; ${c.skipped} preservadas por já estarem revisadas). ${UPDATE_PUBLISHED ? "Posições já publicadas foram atualizadas e continuam publicadas." : "Todos em DRAFT (não aparecem no site)."}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
