import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import type { CandidatePosition } from "../src/domain/types";
import { END, START, questionsMarkdown } from "./questions-markdown";

/** Lê as posições PUBLICADAS do banco configurado em DATABASE_URL e regenera a lista do README. */
async function main() {
  const prisma = new PrismaClient();
  const rows = await prisma.candidatePosition.findMany({ where: { reviewStatus: "PUBLISHED" } });
  await prisma.$disconnect();
  const positions: CandidatePosition[] = rows.map((p) => ({
    id: p.id, candidateId: p.candidateId, questionId: p.questionId, direction: p.direction, closestOptionId: p.closestOptionId,
    summary: p.summary, evidenceIds: [], reviewStatus: p.reviewStatus, updatedAt: p.updatedAt.toISOString(),
  }));
  const last = rows.reduce((m, r) => (r.updatedAt > m ? r.updatedAt : m), new Date(0));
  const snapshot = `${last.toISOString().slice(0, 10).split("-").reverse().join("/")} (${positions.length} posições)`;
  const path = join(__dirname, "..", "README.md");
  const readme = readFileSync(path, "utf8");
  const a = readme.indexOf(START), b = readme.indexOf(END);
  if (a === -1 || b === -1) throw new Error("Marcadores de perguntas não encontrados no README.");
  writeFileSync(path, readme.slice(0, a) + questionsMarkdown(positions, snapshot) + readme.slice(b + END.length));
  console.log(`README atualizado: ${positions.length} posições publicadas.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
