/**
 * Seed inicial.
 *
 * Insere: candidatos, temas, perguntas, alternativas, notas de contexto,
 * argumentos, registro de fontes, protocolos de pesquisa e versão da metodologia.
 *
 * NÃO insere posições de candidatos, evidências nem resumos de programa.
 * Esses registros nascem vazios e só entram após revisão humana de documentos
 * oficiais. Nenhum fato político é incluído porque o modelo "sabe".
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { CANDIDATES } from "../src/data/candidates";
import { CANDIDATE_PROFILES } from "../src/data/candidate-profiles";
import { TOPICS } from "../src/data/topics";
import { QUESTIONS } from "../src/data/questions";
import { CONTEXT_NOTES } from "../src/data/context-notes";
import { ARGUMENT_SETS } from "../src/data/arguments";
import { SOURCE_REGISTRY } from "../src/data/source-registry";
import { RESEARCH_PROTOCOLS } from "../src/data/research-protocols";
import { METHODOLOGY_VERSIONS } from "../src/data/methodology";

const prisma = new PrismaClient();

async function main() {
  for (const c of CANDIDATES) {
    await prisma.candidate.upsert({
      where: { id: c.id },
      create: { id: c.id, slug: c.slug, name: c.name, roleContext: c.roleContext, historySourceIds: c.historySourceIds },
      update: { slug: c.slug, name: c.name, roleContext: c.roleContext, historySourceIds: c.historySourceIds },
    });
  }

  for (const pr of CANDIDATE_PROFILES) {
    const data = pr as unknown as Prisma.InputJsonValue;
    await prisma.candidateProfile.upsert({ where: { candidateId: pr.candidateId }, create: { candidateId: pr.candidateId, data }, update: { data } });
  }

  // Slugs de temas são únicos: libera os slugs atuais antes de reatribuí-los,
  // para que uma renumeração de temas não viole a restrição de unicidade.
  for (const existing of await prisma.topic.findMany({ select: { id: true } })) {
    await prisma.topic.update({ where: { id: existing.id }, data: { slug: `__tmp__${existing.id}` } });
  }

  for (const t of TOPICS) {
    await prisma.topic.upsert({
      where: { id: t.id },
      create: { id: t.id, slug: t.slug, order: t.order, name: t.name, description: t.description, subtopics: t.subtopics ?? [], priorityQuestion: t.priorityQuestion ?? null },
      update: { slug: t.slug, order: t.order, name: t.name, description: t.description, subtopics: t.subtopics ?? [], priorityQuestion: t.priorityQuestion ?? null },
    });
  }

  for (const q of QUESTIONS) {
    const data = {
      topicId: q.topicId,
      subtopic: q.subtopic ?? null,
      order: q.order,
      text: q.text,
      kind: q.kind,
      contextNoteIds: q.contextNoteIds ?? [],
      argumentsId: q.argumentsId ?? null,
      evidenceDistinctions: q.evidenceDistinctions ?? [],
    };
    await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...data }, update: data });
    for (const o of q.options) {
      const od = { questionId: q.id, label: o.label, order: o.order, normalizedValue: o.normalizedValue, isNoOpinion: o.isNoOpinion };
      await prisma.questionOption.upsert({ where: { id: o.id }, create: { id: o.id, ...od }, update: od });
    }
  }

  for (const n of CONTEXT_NOTES) {
    const data = {
      kind: n.kind,
      title: n.title,
      paragraphs: n.paragraphs,
      sourceIds: n.sourceIds,
      asOf: new Date(n.asOf),
      timeline: n.timeline ? (n.timeline as unknown as Prisma.InputJsonValue) : undefined,
    };
    await prisma.contextNote.upsert({ where: { id: n.id }, create: { id: n.id, ...data }, update: data });
  }

  for (const a of ARGUMENT_SETS) {
    const data = { policy: a.policy, inFavor: a.inFavor, against: a.against };
    await prisma.argumentSet.upsert({ where: { id: a.id }, create: { id: a.id, ...data }, update: data });
  }

  for (const s of SOURCE_REGISTRY) {
    const data = {
      name: s.name,
      institution: s.institution,
      url: s.url,
      documentUrl: s.documentUrl ?? null,
      type: s.type,
      legend: s.legend,
      purpose: s.purpose,
      usageRestrictions: s.usageRestrictions ?? null,
      publishedAt: s.publishedAt ? new Date(s.publishedAt) : null,
      retrievedAt: s.retrievedAt ? new Date(s.retrievedAt) : null,
      notes: s.notes ?? null,
      verificationStatus: s.verification.status,
      verificationCheckedAt: s.verification.checkedAt ? new Date(s.verification.checkedAt) : null,
      verificationNote: s.verification.note ?? null,
    };
    await prisma.source.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });
  }

  for (const p of RESEARCH_PROTOCOLS) {
    const data = {
      questionId: p.questionId,
      topic: p.topic,
      subtopic: p.subtopic,
      searchTerms: p.searchTerms,
      sourceIds: p.sourceIds,
      period: p.period,
      inclusionCriteria: p.inclusionCriteria,
      exclusionCriteria: p.exclusionCriteria,
      definedAt: new Date(p.definedAt),
    };
    await prisma.researchProtocol.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }

  for (const m of METHODOLOGY_VERSIONS) {
    const data = {
      version: m.version,
      title: m.title,
      description: m.description,
      effectiveFrom: new Date(m.effectiveFrom),
      effectiveUntil: m.effectiveUntil ? new Date(m.effectiveUntil) : null,
      changeLog: m.changeLog,
    };
    await prisma.methodologyVersion.upsert({ where: { id: m.id }, create: { id: m.id, ...data }, update: data });
    for (const entry of m.changeLog) {
      const exists = await prisma.changeLog.findFirst({ where: { version: m.version, description: entry } });
      if (!exists) await prisma.changeLog.create({ data: { version: m.version, description: entry } });
    }
  }

  // Remove registros órfãos de versões anteriores do questionário. Só é seguro
  // enquanto não houver evidências ou posições apontando para eles.
  const evidenceCount = await prisma.evidence.count();
  const positionCount = await prisma.candidatePosition.count();
  if (evidenceCount === 0 && positionCount === 0) {
    const qIds = QUESTIONS.map((q) => q.id);
    const oIds = QUESTIONS.flatMap((q) => q.options.map((o) => o.id));
    await prisma.questionOption.deleteMany({ where: { id: { notIn: oIds } } });
    await prisma.researchProtocol.deleteMany({ where: { questionId: { notIn: qIds } } });
    await prisma.question.deleteMany({ where: { id: { notIn: qIds } } });
    await prisma.topic.deleteMany({ where: { id: { notIn: TOPICS.map((t) => t.id) } } });
    await prisma.contextNote.deleteMany({ where: { id: { notIn: CONTEXT_NOTES.map((n) => n.id) } } });
    await prisma.argumentSet.deleteMany({ where: { id: { notIn: ARGUMENT_SETS.map((a) => a.id) } } });
  } else {
    console.warn("Há evidências/posições cadastradas: registros antigos de perguntas/temas não foram removidos.");
  }

  await prisma.auditLog.create({
    data: {
      actor: "seed",
      operation: "SEED",
      entity: "database",
      entityId: "initial",
      reason: "Seed inicial: candidatos, temas, perguntas, fontes, protocolos e metodologia. Nenhuma posição de candidato inserida.",
    },
  });

  console.log(
    `Seed concluído: ${CANDIDATES.length} candidatos, ${TOPICS.length} temas, ${QUESTIONS.length} perguntas, ${SOURCE_REGISTRY.length} fontes, ${RESEARCH_PROTOCOLS.length} protocolos. CandidatePosition/Evidence/ProgramSummary: 0 (por design).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
