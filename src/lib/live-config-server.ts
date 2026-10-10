import type { Prisma } from "@prisma/client";
import { dataSourceMode } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { BASELINE_CONFIG, applyConfig, type ChangeItem, type LiveConfig } from "@/lib/live-config";
import type { Impact } from "@/lib/config-impact";

/**
 * Configuração viva no servidor: lê a versão publicada no banco (com um cache curto) e aplica por cima dos dados.
 * Sem banco (modo estático), vale a configuração do código.
 */
export interface PublishedConfig { version: number; cfg: LiveConfig; key: string }

const TTL_MS = 3000;
let cache: { at: number; value: PublishedConfig } | null = null;

const asConfig = (json: Prisma.JsonValue): LiveConfig => json as unknown as LiveConfig;

/** Versão publicada mais recente; cria a versão 1 (estado atual do código) se ainda não houver nenhuma. */
export async function getPublishedConfig(force = false): Promise<PublishedConfig> {
  if (dataSourceMode() !== "prisma") return { version: 0, cfg: BASELINE_CONFIG, key: "base" };
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  const prisma = getPrisma();
  let latest = await prisma.configVersion.findFirst({ orderBy: { id: "desc" } });
  if (!latest) {
    latest = await prisma.configVersion.create({
      data: { author: "Sistema", reason: "Versão inicial: estado do site antes do admin editável", sections: [], changes: [], impact: {}, snapshot: BASELINE_CONFIG as unknown as Prisma.InputJsonValue },
    });
  }
  const value = { version: latest.id, cfg: asConfig(latest.snapshot), key: `v${latest.id}` };
  cache = { at: Date.now(), value };
  return value;
}

/** Aplica a versão publicada nos módulos de dados. Chamar no começo de páginas e rotas que usam perguntas ou a conta. */
export async function ensureLiveConfig(): Promise<PublishedConfig> {
  const pub = await getPublishedConfig();
  applyConfig(pub.cfg, pub.key);
  return pub;
}

export async function getDraft(): Promise<{ cfg: LiveConfig; baseVersion: number; updatedAt: Date } | null> {
  if (dataSourceMode() !== "prisma") return null;
  const d = await getPrisma().configDraft.findUnique({ where: { id: "main" } });
  return d ? { cfg: asConfig(d.snapshot), baseVersion: d.baseVersion, updatedAt: d.updatedAt } : null;
}

/** Rascunho atual ou, se não houver, uma cópia da versão publicada. */
export async function getWorkingConfig(): Promise<{ cfg: LiveConfig; published: PublishedConfig; hasDraft: boolean }> {
  const published = await getPublishedConfig(true);
  const draft = await getDraft();
  return { cfg: draft?.cfg ?? published.cfg, published, hasDraft: !!draft };
}

export async function saveDraft(cfg: LiveConfig, baseVersion: number): Promise<void> {
  const snapshot = cfg as unknown as Prisma.InputJsonValue;
  await getPrisma().configDraft.upsert({ where: { id: "main" }, create: { id: "main", snapshot, baseVersion }, update: { snapshot, baseVersion } });
}

export async function discardDraft(): Promise<void> {
  await getPrisma().configDraft.deleteMany({ where: { id: "main" } });
}

/** Publica uma nova versão (imutável) e limpa o rascunho. */
export async function publishVersion(input: { cfg: LiveConfig; author: string; reason: string; sections: string[]; changes: ChangeItem[]; impact: Impact; rollbackOf?: number | null }): Promise<number> {
  const prisma = getPrisma();
  const created = await prisma.$transaction(async (tx) => {
    const v = await tx.configVersion.create({
      data: {
        author: input.author, reason: input.reason, sections: input.sections, rollbackOf: input.rollbackOf ?? null,
        changes: input.changes as unknown as Prisma.InputJsonValue,
        impact: input.impact as unknown as Prisma.InputJsonValue,
        snapshot: input.cfg as unknown as Prisma.InputJsonValue,
      },
    });
    await tx.configDraft.deleteMany({ where: { id: "main" } });
    return v;
  });
  cache = null;
  await syncQuestionRows(input.cfg);
  return created.id;
}

/** Mantém as tabelas Question/QuestionOption em dia com as perguntas da configuração (para posições e evidências futuras). */
async function syncQuestionRows(cfg: LiveConfig): Promise<void> {
  const prisma = getPrisma();
  for (const q of cfg.questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      create: { id: q.id, topicId: q.topicId, order: q.order, text: q.text, kind: q.kind, contextNoteIds: q.contextNoteIds ?? [], evidenceDistinctions: q.evidenceDistinctions ?? [], subtopic: q.subtopic ?? null, argumentsId: q.argumentsId ?? null },
      update: { text: q.text, topicId: q.topicId, order: q.order },
    }).catch(() => undefined);
    for (const o of q.options) {
      await prisma.questionOption.upsert({
        where: { id: o.id },
        create: { id: o.id, questionId: q.id, label: o.label, order: o.order, normalizedValue: o.normalizedValue, isNoOpinion: o.isNoOpinion },
        update: { label: o.label, order: o.order },
      }).catch(() => undefined);
    }
  }
}

export interface VersionRow { id: number; createdAt: Date; author: string; reason: string; sections: string[]; changes: ChangeItem[]; impact: Impact | Record<string, never>; rollbackOf: number | null }

export async function listVersions(): Promise<VersionRow[]> {
  if (dataSourceMode() !== "prisma") return [];
  const rows = await getPrisma().configVersion.findMany({ orderBy: { id: "desc" }, select: { id: true, createdAt: true, author: true, reason: true, sections: true, changes: true, impact: true, rollbackOf: true } });
  return rows.map((r) => ({ ...r, changes: r.changes as unknown as ChangeItem[], impact: r.impact as unknown as Impact }));
}

export async function getVersion(id: number): Promise<{ row: VersionRow; cfg: LiveConfig } | null> {
  const r = await getPrisma().configVersion.findUnique({ where: { id } });
  if (!r) return null;
  return { row: { ...r, changes: r.changes as unknown as ChangeItem[], impact: r.impact as unknown as Impact }, cfg: asConfig(r.snapshot) };
}

/**
 * Entradas públicas do histórico da metodologia geradas pelas publicações do admin:
 * "Revisão humana" com o que mudou e o motivo. Sem nome de quem publicou e sem nada que leve ao admin.
 */
export async function publicChangelogEntries(): Promise<string[]> {
  if (dataSourceMode() !== "prisma") return [];
  const rows = await getPrisma().configVersion.findMany({ where: { id: { gt: 1 } }, orderBy: { id: "asc" }, select: { createdAt: true, reason: true, changes: true, rollbackOf: true } });
  return rows.map((r) => {
    const changes = (r.changes as unknown as ChangeItem[]).map((c) => c.text);
    const shown = changes.slice(0, 12).join("; ") + (changes.length > 12 ? `; e mais ${changes.length - 12} ajustes` : "");
    const date = r.createdAt.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
    return `Revisão humana (${date}): ${r.rollbackOf ? "volta a uma configuração anterior. " : ""}${shown}. Motivo: ${r.reason}`;
  });
}
