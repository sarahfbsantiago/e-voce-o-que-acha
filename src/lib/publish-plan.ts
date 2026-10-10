import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { getPublishedConfig, getVersion, getWorkingConfig, type PublishedConfig } from "@/lib/live-config-server";
import { diffConfig, validateConfig, withConfig, type ChangeItem, type LiveConfig } from "@/lib/live-config";
import { computeImpact, type Impact } from "@/lib/config-impact";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";

/** Nome curto de cada seção, usado na frase de confirmação. */
const SHORT: Record<string, string> = { "Notas por alternativa": "notas", "Espectro político": "espectro", "Régua": "régua", "Perguntas": "perguntas" };

export interface PublishPlan {
  mode: "draft" | "rollback";
  rollbackOf: number | null;
  published: PublishedConfig;
  target: LiveConfig;
  changes: ChangeItem[];
  sections: string[];
  errors: string[];
  impact: Impact | null;
  phrase: string;
  examples: { before: string; after: string; rulerBefore: string; rulerAfter: string }[];
}

/** Prepara a publicação: o que muda, se pode publicar, o impacto nos questionários reais e a frase a digitar. */
export async function buildPublishPlan(rollbackId: number | null): Promise<PublishPlan | null> {
  const published = await getPublishedConfig(true);
  let target: LiveConfig;
  if (rollbackId) {
    const v = await getVersion(rollbackId);
    if (!v) return null;
    target = v.cfg;
  } else {
    const w = await getWorkingConfig();
    if (!w.hasDraft) return { mode: "draft", rollbackOf: null, published, target: published.cfg, changes: [], sections: [], errors: [], impact: null, phrase: "", examples: [] };
    target = w.cfg;
  }
  const numbers = { ...withConfig(published.cfg, published.cfg, () => ({ ...QUESTION_NUMBER })), ...withConfig(target, published.cfg, () => ({ ...QUESTION_NUMBER })) };
  const changes = diffConfig(published.cfg, target, numbers);
  const sections = [...new Set(changes.map((c) => c.section))];
  const errors = validateConfig(target);
  let impact: Impact | null = null;
  const examples: PublishPlan["examples"] = [];
  if (changes.length) {
    const [stats, content] = [await getStatsRepository(), await getContentRepository()];
    const subs = stats.enabled ? await stats.listSubmissions() : [];
    const [candidates, positions] = await Promise.all([content.getCandidates(), content.getPublishedPositions()]);
    impact = computeImpact(subs, candidates, positions, published.cfg, target, published.cfg);
    const ids = candidates.map((c) => c.id);
    const name = (id: string | null) => (id ? candidates.find((c) => c.id === id)?.name ?? id : "—");
    const sample = subs.slice(-200);
    const before = withConfig(published.cfg, published.cfg, () => sample.map((s) => { const p = personSpectrum(s.answers); return { i: p?.ideology ?? "—", r: p ? name(closestCandidateOnRuler(p.at, ids)) : "—" }; }));
    const after = withConfig(target, published.cfg, () => sample.map((s) => { const p = personSpectrum(s.answers); return { i: p?.ideology ?? "—", r: p ? name(closestCandidateOnRuler(p.at, ids)) : "—" }; }));
    for (let k = 0; k < sample.length && examples.length < 4; k++) if (before[k].i !== after[k].i || before[k].r !== after[k].r) examples.push({ before: before[k].i, after: after[k].i, rulerBefore: before[k].r, rulerAfter: after[k].r });
  }
  const phrase = rollbackId ? `voltar para v${rollbackId}` : sections.length ? `atualizar ${sections.map((s) => SHORT[s] ?? s.toLowerCase()).join(" e ")}` : "";
  return { mode: rollbackId ? "rollback" : "draft", rollbackOf: rollbackId, published, target, changes, sections, errors, impact, phrase, examples };
}
