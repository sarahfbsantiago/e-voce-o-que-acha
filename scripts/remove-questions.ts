/**
 * Remove do banco as perguntas tiradas do questionário (revisão humana, 07/10/2026):
 * posições, evidências, protocolos, alternativas e a própria pergunta.
 * Antes de apagar, guarda uma cópia completa no AuditLog (campo before) e em um arquivo JSON local,
 * para que tudo possa ser restaurado. Respostas antigas guardadas em SurveySubmission não são alteradas;
 * as contas já usam só as perguntas que ficaram.
 *
 * Uso: npx tsx scripts/remove-questions.ts
 */
import { writeFileSync } from "node:fs";
import { PrismaClient, Prisma } from "@prisma/client";
import { QUESTION_BY_ID } from "../src/data/questions";

export const REMOVED_QUESTION_IDS = ["q24", "q39", "q41", "q48", "q49"];
const prisma = new PrismaClient();

async function main() {
  for (const id of REMOVED_QUESTION_IDS) if (QUESTION_BY_ID[id]) throw new Error(`${id} ainda está em src/data/questions.ts`);

  const where = { questionId: { in: REMOVED_QUESTION_IDS } };
  const backup = {
    questions: await prisma.question.findMany({ where: { id: { in: REMOVED_QUESTION_IDS } }, include: { options: true } }),
    positions: await prisma.candidatePosition.findMany({ where, include: { evidences: true } }),
    evidence: await prisma.evidence.findMany({ where }),
    protocols: await prisma.researchProtocol.findMany({ where }),
  };
  const file = `remocao-perguntas-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(file, JSON.stringify(backup, null, 1));

  await prisma.$transaction([
    prisma.auditLog.create({
      data: {
        actor: "Sarah Santiago",
        operation: "DELETE",
        entity: "Question",
        entityId: REMOVED_QUESTION_IDS.join(","),
        before: JSON.parse(JSON.stringify(backup)) as Prisma.InputJsonValue,
        reason: "Revisão humana: perguntas retiradas do questionário (07/10/2026).",
      },
    }),
    prisma.candidatePositionEvidence.deleteMany({ where: { position: { questionId: { in: REMOVED_QUESTION_IDS } } } }),
    prisma.candidatePosition.deleteMany({ where }),
    prisma.evidence.deleteMany({ where }),
    prisma.researchProtocol.deleteMany({ where }),
    prisma.questionOption.deleteMany({ where }),
    prisma.question.deleteMany({ where: { id: { in: REMOVED_QUESTION_IDS } } }),
  ]);
  console.log(`Removidas ${backup.questions.length} perguntas, ${backup.positions.length} posições, ${backup.evidence.length} evidências, ${backup.protocols.length} protocolos. Cópia em ${file} e no AuditLog.`);
}

main().finally(() => prisma.$disconnect());
