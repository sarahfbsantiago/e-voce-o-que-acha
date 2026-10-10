import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { getPublishedConfig, getWorkingConfig, type PublishedConfig } from "@/lib/live-config-server";
import { diffConfig, validateConfig, withConfig, type ChangeItem, type LiveConfig } from "@/lib/live-config";
import { computeImpact, type Impact } from "@/lib/config-impact";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";

/** Quantos envios recentes entram na conta de impacto. */
export const IMPACT_SAMPLE = 10000;

/** Nome curto de cada seção, usado na frase de confirmação. */
const SHORT: Record<string, string> = { "Notas por alternativa": "notas", "Espectro político": "espectro", "Régua": "régua", "Perguntas": "perguntas", "Textos do site": "textos", "Revisão de posições": "posições", "Fontes e links": "fontes" };

export interface PublishPlan {
  mode: "draft" | "request";
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

/** Plano do rascunho atual (o que mudou), sem impacto. */
export async function buildDraftPlan(): Promise<PublishPlan> {
  const published = await getPublishedConfig(true);
  const w = await getWorkingConfig();
  return buildPlanFor(w.hasDraft ? w.cfg : published.cfg, published, null, "draft", false);
}

/** Prepara a publicação: o que muda, se pode publicar, o impacto nos questionários reais e a frase a digitar. */
export async function buildPublishPlan(target: LiveConfig, rollbackId: number | null): Promise<PublishPlan> {
  const published = await getPublishedConfig(true);
  return buildPlanFor(target, published, rollbackId, "request", true);
}

/** Números de exibição das perguntas (1, 2, 3…) da versão no ar e do alvo, para os textos das mudanças. */
export function numbersFor(published: LiveConfig, target: LiveConfig): Record<string, number> {
  return { ...withConfig(published, published, () => ({ ...QUESTION_NUMBER })), ...withConfig(target, published, () => ({ ...QUESTION_NUMBER })) };
}

async function buildPlanFor(target: LiveConfig, published: PublishedConfig, rollbackId: number | null, mode: PublishPlan["mode"], withImpact: boolean): Promise<PublishPlan> {
  const numbers = numbersFor(published.cfg, target);
  const changes = diffConfig(published.cfg, target, numbers);
  const sections = [...new Set(changes.map((c) => c.section))];
  const errors = validateConfig(target);
  let impact: Impact | null = null;
  const examples: PublishPlan["examples"] = [];
  if (changes.length && withImpact) {
    const [stats, content] = [await getStatsRepository(), await getContentRepository()];
    // amostra dos envios mais recentes: o impacto fica rápido e com memória fixa, com qualquer volume
    const [subs, population] = stats.enabled ? await Promise.all([stats.listRecentSubmissions(IMPACT_SAMPLE), stats.countSubmissions()]) : [[], 0];
    const [candidates, positions] = await Promise.all([content.getCandidates(), content.getPublishedPositions()]);
    impact = computeImpact(subs, candidates, positions, published.cfg, target, published.cfg);
    impact.population = population;
    if (population > subs.length) impact.summary.unshift(`Estimativa com os ${subs.length.toLocaleString("pt-BR")} questionários mais recentes (de ${population.toLocaleString("pt-BR")})`);
    const ids = candidates.map((c) => c.id);
    const name = (id: string | null) => (id ? candidates.find((c) => c.id === id)?.name ?? id : "—");
    const sample = subs.slice(-200);
    const before = withConfig(published.cfg, published.cfg, () => sample.map((s) => { const p = personSpectrum(s.answers); return { i: p?.ideology ?? "—", r: p ? name(closestCandidateOnRuler(p.at, ids)) : "—" }; }));
    const after = withConfig(target, published.cfg, () => sample.map((s) => { const p = personSpectrum(s.answers); return { i: p?.ideology ?? "—", r: p ? name(closestCandidateOnRuler(p.at, ids)) : "—" }; }));
    for (let k = 0; k < sample.length && examples.length < 4; k++) if (before[k].i !== after[k].i || before[k].r !== after[k].r) examples.push({ before: before[k].i, after: after[k].i, rulerBefore: before[k].r, rulerAfter: after[k].r });
  }
  const phrase = rollbackId ? `voltar para v${rollbackId}` : sections.length ? `atualizar ${sections.map((s) => SHORT[s] ?? s.toLowerCase()).join(" e ")}` : "";
  return { mode, rollbackOf: rollbackId, published, target, changes, sections, errors, impact, phrase, examples };
}
