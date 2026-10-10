import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { stableStringify } from "@/lib/live-config";
import { getPrisma } from "@/lib/prisma";
import { addToTally, emptyTally, profileFromTally, type ResearchTally } from "@/lib/research-tally";
import { reportFromTally, type ResearchReport } from "@/lib/research-report";
import type { SubmissionCursor } from "@/lib/repository/types";

const KEY = "research";
/** Envios lidos por vez: memória fica pequena com qualquer volume. */
const BATCH = 2000;
/** Quanto a página espera pela soma antes de mostrar o que já foi somado. */
const WAIT_MS = 4000;

export interface ResearchStatus {
  /** envios já somados na conta atual */
  processed: number;
  /** envios no banco */
  total: number;
  /** ainda somando (envios novos ou recontagem depois de uma publicação) */
  catchingUp: boolean;
}

let running: Promise<void> | null = null;

/** Muda quando muda a conta: versão publicada (perguntas, notas, régua) ou posições publicadas. */
async function fingerprint(): Promise<string> {
  const pub = await ensureLiveConfig();
  const positions = await (await getContentRepository()).getPublishedPositions();
  const pos = [...positions].sort((a, b) => a.id.localeCompare(b.id)).map((p) => [p.id, p.candidateId, p.questionId, p.direction, p.closestOptionId]);
  return `${pub.key}:${createHash("sha256").update(stableStringify(pos)).digest("hex").slice(0, 16)}`;
}

/** Soma os envios que faltam, em lotes, salvando o progresso a cada lote. Se a conta mudar no meio, para. */
async function advance(): Promise<void> {
  const prisma = getPrisma();
  const stats = await getStatsRepository();
  const content = await getContentRepository();
  const fp = await fingerprint();
  const row = await prisma.statsSnapshot.findUnique({ where: { key: KEY } });
  const fresh = !row || row.fingerprint !== fp;
  let tally: ResearchTally = fresh ? emptyTally() : (row!.tally as unknown as ResearchTally);
  let cursor: SubmissionCursor | null = fresh || !row!.cursorAt ? null : { at: row!.cursorAt.toISOString(), id: row!.cursorId! };
  let processed = fresh ? 0 : row!.processed;
  let rev = row?.rev ?? 0;
  if (!row) {
    await prisma.statsSnapshot.create({ data: { key: KEY, fingerprint: fp, processed: 0, tally: tally as unknown as Prisma.InputJsonValue } }).catch(() => null);
    rev = 0;
  } else if (fresh) {
    const ok = await prisma.statsSnapshot.updateMany({ where: { key: KEY, rev }, data: { fingerprint: fp, cursorAt: null, cursorId: null, processed: 0, tally: tally as unknown as Prisma.InputJsonValue, rev: rev + 1 } });
    if (!ok.count) return;
    rev++;
  }
  for (;;) {
    if ((await fingerprint()) !== fp) return; // publicaram algo no meio: a próxima rodada recomeça
    const [candidates, positions] = await Promise.all([content.getCandidates(), content.getPublishedPositions()]);
    const batch = await stats.listSubmissionsAfter(cursor, BATCH);
    if (!batch.length) return;
    tally = addToTally(tally, batch, candidates, positions);
    processed += batch.length;
    const last = batch[batch.length - 1];
    cursor = { at: last.submittedAt, id: last.id };
    const ok = await prisma.statsSnapshot.updateMany({
      where: { key: KEY, rev },
      data: { cursorAt: new Date(cursor.at), cursorId: cursor.id, processed, tally: tally as unknown as Prisma.InputJsonValue, rev: rev + 1 },
    });
    if (!ok.count) return; // outra rodada salvou antes: esta para para não contar duas vezes
    rev++;
    if (batch.length < BATCH) return;
  }
}

/** Dispara a soma (uma por vez neste servidor) e devolve quando terminar ou depois de alguns segundos. */
async function catchUp() {
  running ??= advance().catch((e) => console.error("[pesquisa] erro ao somar envios", e)).finally(() => { running = null; });
  await Promise.race([running, new Promise((r) => setTimeout(r, WAIT_MS))]);
}

/** Relatório do painel: lê as contagens salvas e soma só o que chegou depois. Nunca carrega todos os envios. */
export async function getResearchReport(): Promise<{ report: ResearchReport; status: ResearchStatus }> {
  const stats = await getStatsRepository();
  const content = await getContentRepository();
  await catchUp();
  const fp = await fingerprint();
  const [row, total, feedback, candidates] = await Promise.all([
    getPrisma().statsSnapshot.findUnique({ where: { key: KEY } }), stats.countSubmissions(), stats.feedbackSummary(), content.getCandidates(),
  ]);
  const valid = row && row.fingerprint === fp;
  const tally = valid ? (row.tally as unknown as ResearchTally) : emptyTally();
  const processed = valid ? row.processed : 0;
  return {
    report: reportFromTally(tally, feedback, profileFromTally(tally, candidates)),
    status: { processed, total, catchingUp: processed < total },
  };
}
