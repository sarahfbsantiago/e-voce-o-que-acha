/**
 * Aplica as posições de Flávio Bolsonaro derivadas do texto "Visão Flávio" (revisão humana, 07/10/2026).
 *
 * Para cada pergunta de src/data/flavio-view-positions.ts:
 * - cria (ou atualiza) uma evidência publicada, ligada à fonte jornalística correspondente;
 * - atualiza a posição publicada de Flávio (ou cria, se não houver), trocando as evidências ligadas;
 * - registra o antes e o depois no AuditLog.
 * Perguntas fora da lista não mudam.
 *
 * Uso: npx tsx scripts/apply-flavio-view.ts
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { FLAVIO_VIEW_POSITIONS } from "../src/data/flavio-view-positions";
import { QUESTION_BY_ID } from "../src/data/questions";

const prisma = new PrismaClient();
const CANDIDATE = "flavio-bolsonaro";
const REVIEWED_AT = new Date("2026-10-07T12:00:00-03:00");

/** Fonte de cada pergunta: jornada (UOL), impostos e gasto (Folha mercado), demais (Folha, plano de governo). */
function sourceFor(questionId: string): string {
  if (questionId === "q05" || questionId === "q06") return "uol-flavio-escala-6x1-2026";
  if (questionId === "q03") return "folha-flavio-imposto-folha-2026";
  return "folha-flavio-plano-governo-stf-2026";
}

async function main() {
  let created = 0, updated = 0;
  for (const v of FLAVIO_VIEW_POSITIONS) {
    const q = QUESTION_BY_ID[v.questionId];
    if (!q) throw new Error(`Pergunta inexistente: ${v.questionId}`);
    if (v.closestOptionId && !q.options.some((o) => o.id === v.closestOptionId)) {
      throw new Error(`Alternativa inexistente: ${v.closestOptionId}`);
    }

    const evidenceId = `ev-visao-flavio-${v.questionId}`;
    const sourceId = sourceFor(v.questionId);
    await prisma.evidence.upsert({
      where: { id: evidenceId },
      create: {
        id: evidenceId,
        candidateId: CANDIDATE,
        questionId: v.questionId,
        topicId: q.topicId,
        title: "Visão Flávio (texto revisado pela responsável)",
        summary: v.basis,
        originalExcerpt: v.basis,
        sourceId,
        sourceType: "professional_press",
        publicationDate: REVIEWED_AT,
        retrievedAt: REVIEWED_AT,
        classification: "POSICAO",
        evidenceStrength: "C",
        reviewStatus: "PUBLISHED",
        classificationCriterion: "Revisão humana: posição tirada do texto 'Visão Flávio' de 07/10/2026.",
      },
      update: { summary: v.basis, originalExcerpt: v.basis, sourceId, reviewStatus: "PUBLISHED" },
    });

    const summary = `Visão Flávio (revisão humana): ${v.basis}`;
    const existing = await prisma.candidatePosition.findMany({
      where: { candidateId: CANDIDATE, questionId: v.questionId, reviewStatus: "PUBLISHED" },
      include: { evidences: true },
    });

    if (existing.length === 0) {
      const pos = await prisma.candidatePosition.create({
        data: {
          candidateId: CANDIDATE,
          questionId: v.questionId,
          direction: v.direction,
          closestOptionId: v.closestOptionId ?? null,
          summary,
          reviewStatus: "PUBLISHED",
          evidences: { create: [{ evidenceId }] },
        },
      });
      await prisma.auditLog.create({
        data: { actor: "Sarah Santiago", operation: "CREATE", entity: "CandidatePosition", entityId: pos.id, after: { direction: v.direction, closestOptionId: v.closestOptionId ?? null }, reason: "Revisão humana: texto Visão Flávio (07/10/2026)." },
      });
      created++;
      continue;
    }

    // Uma posição publicada por pergunta: a primeira é atualizada; extras saem de publicação.
    const [main, ...extra] = existing;
    await prisma.candidatePosition.update({
      where: { id: main.id },
      data: {
        direction: v.direction,
        closestOptionId: v.closestOptionId ?? null,
        summary,
        evidences: { deleteMany: {}, create: [{ evidenceId }] },
      },
    });
    for (const x of extra) await prisma.candidatePosition.update({ where: { id: x.id }, data: { reviewStatus: "REJECTED" } });
    await prisma.auditLog.create({
      data: {
        actor: "Sarah Santiago",
        operation: "UPDATE",
        entity: "CandidatePosition",
        entityId: main.id,
        before: { direction: main.direction, closestOptionId: main.closestOptionId, summary: main.summary, evidenceIds: main.evidences.map((e) => e.evidenceId) } as Prisma.InputJsonValue,
        after: { direction: v.direction, closestOptionId: v.closestOptionId ?? null, evidenceIds: [evidenceId] },
        reason: "Revisão humana: texto Visão Flávio (07/10/2026).",
      },
    });
    updated++;
  }
  console.log(`Visão Flávio aplicada: ${updated} posições atualizadas, ${created} criadas, ${FLAVIO_VIEW_POSITIONS.length} perguntas no total.`);
}

main().finally(() => prisma.$disconnect());
