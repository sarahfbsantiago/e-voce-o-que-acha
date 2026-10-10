import type { Question, QuestionOption } from "@/domain/types";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import { recomputeQuestionOrder } from "@/lib/question-order";
import { OPTION_SCORES } from "@/data/option-scores";
import { SPECTRUM_POSITIONS } from "@/data/spectrum-positions";
import { SPECTRUM_TERMS } from "@/data/spectrum-terms";
import { CANDIDATE_SPECTRUM, IDEOLOGY_RANGES, RULER_RULES, SPECTRUM_BANDS, type SpectrumBandLabel } from "@/data/political-spectrum";
import { TOPICS } from "@/data/topics";
import { SITE_TEXTS, type SiteTexts } from "@/data/site-texts";
import { IDEOLOGY_PROFILES, type IdeologyProfile } from "@/data/ideology-profiles";
import { SPECTRUM_COMPARISON, SPECTRUM_INTRO, SPECTRUM_SECTIONS, type SpectrumBlock, type SpectrumSection } from "@/data/spectrum-terms";
import { SPECTRUM_HISTORY, type SectionHistory } from "@/data/spectrum-history";
import { CANDIDATE_VIEWS, type CandidateView } from "@/data/candidate-views";
import { CANDIDATE_PROFILES, CANDIDATE_PROFILE_BY_ID } from "@/data/candidate-profiles";
import { EVIDENCE_OVERRIDES, POSITION_OVERRIDES, type EvidenceOverride, type PositionOverride } from "@/data/position-overrides";
import type { CandidateProfile, SourceRegistryEntry } from "@/domain/types";
import { SOURCE_BY_ID, SOURCE_REGISTRY } from "@/data/source-registry";

/**
 * Configuração viva do site: perguntas, notas por alternativa, faixas da régua e posições na régua.
 * Fica no banco (versões publicadas pelo admin) e é aplicada por cima dos módulos de dados, no servidor e no navegador,
 * para que toda a conta (relatório, painel, PDF, exportações) use exatamente os mesmos valores.
 */
export const CANDIDATE_IDS = ["lula", "flavio-bolsonaro"] as const;
export const CANDIDATE_SHORT: Record<string, string> = { lula: "Lula", "flavio-bolsonaro": "Flávio" };

/** Textos do site (não mexem na conta) e ajustes das posições/evidências. */
export interface SiteContent {
  pages: SiteTexts;
  profiles: Record<string, IdeologyProfile>;
  spectrumIntro: SpectrumBlock[];
  spectrumSections: SpectrumSection[];
  spectrumComparison: SpectrumSection;
  history: Record<string, SectionHistory>;
  candidateViews: CandidateView[];
  candidateProfiles: CandidateProfile[];
  /** Fontes e links (página Fontes e links das evidências). Versões antigas não têm: usam o estado inicial. */
  sources?: SourceRegistryEntry[];
  positions: Record<string, PositionOverride>;
  evidence: Record<string, EvidenceOverride>;
}

export interface LiveConfig {
  /** Todas as perguntas, ativas e arquivadas, na ordem de cadastro. */
  questions: Question[];
  /** Ids das perguntas arquivadas (fora do questionário e da conta; respostas antigas ficam guardadas). */
  archived: string[];
  /** "pergunta|candidato|oN" → [nota, motivo]. */
  optionScores: Record<string, [number, string]>;
  /** "pergunta|oN" → [faixa, motivo]. */
  spectrumPositions: Record<string, [SpectrumBandLabel, string]>;
  /** Ponto (0 a 8) para onde a seta de cada corrente aponta. */
  terms: Record<string, number>;
  /** Ponto (0 a 8) de cada candidato na régua. */
  candidates: Record<string, number>;
  /** Fim (0 a 8) do trecho de cada ideologia; a última vai até o fim da régua (null). */
  ideologyBounds: Record<string, number | null>;
  /** A partir deste ponto a pessoa fica mais perto do candidato da direita. */
  rightSideFrom: number;
  /** Textos e posições (versões antigas, sem isso, usam o estado inicial). */
  content?: SiteContent;
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** JSON com as chaves em ordem (o banco reordena as chaves; comparar assim evita falsas diferenças). */
export function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v as object).filter((k) => (v as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stableStringify((v as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(v ?? null);
}
export const sameJson = (a: unknown, b: unknown) => stableStringify(a) === stableStringify(b);

/** Estado de origem (o que está no código), capturado antes de qualquer alteração. */
export const BASELINE_CONFIG: LiveConfig = clone({
  questions: QUESTIONS,
  archived: [],
  optionScores: OPTION_SCORES,
  spectrumPositions: SPECTRUM_POSITIONS as Record<string, [SpectrumBandLabel, string]>,
  terms: Object.fromEntries(SPECTRUM_TERMS.map((t) => [t.label, t.at])),
  candidates: Object.fromEntries(Object.entries(CANDIDATE_SPECTRUM).map(([id, c]) => [id, c.at])),
  ideologyBounds: Object.fromEntries(IDEOLOGY_RANGES.map((r) => [r.label, Number.isFinite(r.upTo) ? r.upTo : null])),
  rightSideFrom: RULER_RULES.rightSideFrom,
  content: {
    pages: SITE_TEXTS, profiles: IDEOLOGY_PROFILES, spectrumIntro: SPECTRUM_INTRO, spectrumSections: SPECTRUM_SECTIONS,
    spectrumComparison: SPECTRUM_COMPARISON, history: SPECTRUM_HISTORY, candidateViews: CANDIDATE_VIEWS,
    candidateProfiles: CANDIDATE_PROFILES, sources: SOURCE_REGISTRY, positions: {}, evidence: {},
  },
});

/** Garante o bloco de textos (versões publicadas antes dele não o têm). */
export function contentOf(cfg: LiveConfig): SiteContent {
  const c = cfg.content ?? BASELINE_CONFIG.content!;
  return c.sources ? c : { ...c, sources: BASELINE_CONFIG.content!.sources };
}

const replaceRecord = <T,>(target: Record<string, T>, src: Record<string, T>) => { for (const k of Object.keys(target)) delete target[k]; Object.assign(target, clone(src)); };
const replaceArray = <T,>(target: T[], src: T[]) => { target.splice(0, target.length, ...clone(src)); };

function applyContent(c: SiteContent): void {
  Object.assign(SITE_TEXTS, clone(c.pages));
  replaceRecord(IDEOLOGY_PROFILES, c.profiles);
  replaceArray(SPECTRUM_INTRO, c.spectrumIntro);
  replaceArray(SPECTRUM_SECTIONS, c.spectrumSections);
  Object.assign(SPECTRUM_COMPARISON, clone(c.spectrumComparison));
  replaceRecord(SPECTRUM_HISTORY, c.history);
  replaceArray(CANDIDATE_VIEWS, c.candidateViews);
  replaceArray(CANDIDATE_PROFILES, c.candidateProfiles);
  replaceRecord(CANDIDATE_PROFILE_BY_ID, Object.fromEntries(c.candidateProfiles.map((p) => [p.candidateId, p])));
  replaceArray(SOURCE_REGISTRY, c.sources ?? []);
  replaceRecord(SOURCE_BY_ID, Object.fromEntries((c.sources ?? []).map((x) => [x.id, x])));
  replaceRecord(POSITION_OVERRIDES, c.positions ?? {});
  replaceRecord(EVIDENCE_OVERRIDES, c.evidence ?? {});
}

let appliedKey = "";

/** Aplica a configuração por cima dos módulos de dados (no mesmo lugar, para todos os módulos verem). */
export function applyConfig(cfg: LiveConfig, key = JSON.stringify(cfg)): void {
  if (key === appliedKey) return;
  const archived = new Set(cfg.archived);
  const all = clone(cfg.questions);
  QUESTIONS.splice(0, QUESTIONS.length, ...all.filter((q) => !archived.has(q.id)));
  for (const k of Object.keys(QUESTION_BY_ID)) delete QUESTION_BY_ID[k];
  for (const q of all) QUESTION_BY_ID[q.id] = q;
  recomputeQuestionOrder();
  for (const k of Object.keys(OPTION_SCORES)) delete OPTION_SCORES[k];
  Object.assign(OPTION_SCORES, clone(cfg.optionScores));
  const sp = SPECTRUM_POSITIONS as Record<string, [string, string]>;
  for (const k of Object.keys(sp)) delete sp[k];
  Object.assign(sp, clone(cfg.spectrumPositions));
  for (const t of SPECTRUM_TERMS) if (cfg.terms[t.label] !== undefined) t.at = cfg.terms[t.label];
  for (const [id, c] of Object.entries(CANDIDATE_SPECTRUM)) if (cfg.candidates[id] !== undefined) c.at = cfg.candidates[id];
  for (const r of IDEOLOGY_RANGES) if (r.label in cfg.ideologyBounds) r.upTo = cfg.ideologyBounds[r.label] ?? Infinity;
  RULER_RULES.rightSideFrom = cfg.rightSideFrom;
  applyContent(contentOf(cfg));
  appliedKey = key;
}

/** Roda `fn` com outra configuração aplicada e volta à anterior. `fn` precisa ser síncrona (nada de await no meio). */
export function withConfig<T>(cfg: LiveConfig, restore: LiveConfig, fn: () => T): T {
  applyConfig(cfg);
  try { return fn(); } finally { applyConfig(restore); }
}

const optNum = (optionId: string) => optionId.split("-").pop()!;
export const scoreKey = (qid: string, cid: string, optionId: string) => `${qid}|${cid}|${optNum(optionId)}`;
export const bandKey = (qid: string, optionId: string) => `${qid}|${optNum(optionId)}`;
export const activeQuestions = (cfg: LiveConfig) => cfg.questions.filter((q) => !cfg.archived.includes(q.id));

/** Ordem de exibição (a do questionário: áreas → temas → ordem), para numerar 1, 2, 3… */
export function questionNumbers(cfg: LiveConfig, areaTopicOrder: string[]): Record<string, number> {
  const act = activeQuestions(cfg);
  const ordered = areaTopicOrder.flatMap((t) => act.filter((q) => q.topicId === t).sort((a, b) => a.order - b.order));
  return Object.fromEntries(ordered.map((q, i) => [q.id, i + 1]));
}

/** Problemas que impedem publicar. Lista vazia = pode publicar. */
export function validateConfig(cfg: LiveConfig): string[] {
  const errs: string[] = [];
  const topicIds = new Set(TOPICS.map((t) => t.id));
  const ids = new Set<string>();
  for (const q of cfg.questions) {
    if (ids.has(q.id)) errs.push(`Pergunta ${q.id} repetida.`);
    ids.add(q.id);
    if (cfg.archived.includes(q.id)) continue;
    if (!q.text.trim()) errs.push(`Pergunta ${q.id}: texto vazio.`);
    if (!topicIds.has(q.topicId)) errs.push(`Pergunta ${q.id}: tema inválido.`);
    const opts = q.options.filter((o) => !o.isNoOpinion);
    if (opts.length < 2) errs.push(`Pergunta "${q.text.slice(0, 40)}": precisa de pelo menos 2 alternativas.`);
    for (const o of opts) {
      if (!o.label.trim()) errs.push(`Pergunta "${q.text.slice(0, 40)}": alternativa sem texto.`);
      for (const c of CANDIDATE_IDS) if (!cfg.optionScores[scoreKey(q.id, c, o.id)]) errs.push(`"${o.label}" (${q.text.slice(0, 30)}…): falta a nota de ${CANDIDATE_SHORT[c]}.`);
      if (!cfg.spectrumPositions[bandKey(q.id, o.id)]) errs.push(`"${o.label}" (${q.text.slice(0, 30)}…): falta a faixa na régua.`);
    }
  }
  for (const [k, v] of Object.entries(cfg.optionScores)) if (![0, 0.5, 1].includes(v[0])) errs.push(`Nota inválida em ${k}: use 0, 0,5 ou 1.`);
  const bands = new Set<string>(SPECTRUM_BANDS.map((b) => b.label));
  for (const [k, v] of Object.entries(cfg.spectrumPositions)) if (!bands.has(v[0])) errs.push(`Faixa inválida em ${k}.`);
  // régua
  const order = SPECTRUM_TERMS.map((t) => t.label);
  let prev = -Infinity;
  for (const label of order) {
    const at = cfg.terms[label];
    if (at === undefined || at < 0 || at > 8) { errs.push(`${label}: posição fora da régua (0 a 8).`); continue; }
    if (at <= prev) errs.push(`${label} precisa ficar à direita da corrente anterior (as correntes não podem se cruzar).`);
    prev = at;
  }
  const ranges = IDEOLOGY_RANGES.map((r) => r.label);
  let lo = 0;
  for (const label of ranges) {
    const up = cfg.ideologyBounds[label] ?? 8;
    if (up <= lo) errs.push(`Trecho de ${label} ficou vazio ou invertido.`);
    const spot = cfg.terms[label];
    if (spot !== undefined && !(spot > lo - 1e-9 && spot <= up + 1e-9)) errs.push(`A seta de ${label} precisa ficar dentro do trecho dela.`);
    lo = up;
  }
  const [a, b] = [cfg.candidates.lula, cfg.candidates["flavio-bolsonaro"]];
  for (const [id, at] of Object.entries(cfg.candidates)) if (at < 0 || at > 8) errs.push(`${CANDIDATE_SHORT[id] ?? id}: posição fora da régua.`);
  if (!(cfg.rightSideFrom > Math.min(a, b) && cfg.rightSideFrom < Math.max(a, b))) errs.push("A linha divisória precisa ficar entre Lula e Flávio.");
  return errs;
}

const fmtScore = (n: number) => (n === 0.5 ? "0,5" : String(n));
const fmtAt = (n: number | null) => (n === null ? "fim" : String(Math.round(n * 100) / 100).replace(".", ","));

export type ChangeSection = "Notas por alternativa" | "Espectro político" | "Régua" | "Perguntas" | "Textos do site" | "Revisão de posições" | "Fontes e links";
export interface ChangeItem { section: ChangeSection; text: string }

/** Lista legível do que mudou de `a` para `b`. */
export function diffConfig(a: LiveConfig, b: LiveConfig, numbers: Record<string, number> = {}): ChangeItem[] {
  const out: ChangeItem[] = [];
  const qa = new Map(a.questions.map((q) => [q.id, q]));
  const qb = new Map(b.questions.map((q) => [q.id, q]));
  const qlabel = (id: string) => (numbers[id] ? `Pergunta ${numbers[id]}` : `Pergunta ${(qb.get(id) ?? qa.get(id))?.text.slice(0, 40) ?? id}`);
  const olabel = (qid: string, oid: string) => (qb.get(qid) ?? qa.get(qid))?.options.find((o) => optNum(o.id) === optNum(oid))?.label ?? oid;
  for (const q of b.questions) {
    const old = qa.get(q.id);
    if (!old) { out.push({ section: "Perguntas", text: `Nova pergunta: "${q.text}"` }); continue; }
    if (old.text !== q.text) out.push({ section: "Perguntas", text: `${qlabel(q.id)}: texto "${old.text}" → "${q.text}"` });
    if ((old.example ?? "") !== (q.example ?? "")) out.push({ section: "Perguntas", text: `${qlabel(q.id)}: exemplo alterado` });
    for (const o of q.options) {
      const oo = old.options.find((x) => x.id === o.id);
      if (!oo) out.push({ section: "Perguntas", text: `${qlabel(q.id)}: nova alternativa "${o.label}"` });
      else if (oo.label !== o.label) out.push({ section: "Perguntas", text: `${qlabel(q.id)}: alternativa "${oo.label}" → "${o.label}"` });
    }
  }
  for (const id of b.archived) if (!a.archived.includes(id)) out.push({ section: "Perguntas", text: `${qlabel(id)} arquivada: "${qb.get(id)?.text ?? id}"` });
  for (const id of a.archived) if (!b.archived.includes(id)) out.push({ section: "Perguntas", text: `Pergunta restaurada: "${qb.get(id)?.text ?? id}"` });
  for (const k of new Set([...Object.keys(a.optionScores), ...Object.keys(b.optionScores)])) {
    const [x, y] = [a.optionScores[k]?.[0], b.optionScores[k]?.[0]];
    if (x === y) continue;
    const [qid, cid, o] = k.split("|");
    if (!qa.has(qid) && x === undefined) continue; // nota de pergunta nova já aparece como "Nova pergunta"
    out.push({ section: "Notas por alternativa", text: `${qlabel(qid)} · ${CANDIDATE_SHORT[cid] ?? cid} · "${olabel(qid, o)}": ${x === undefined ? "—" : fmtScore(x)} → ${y === undefined ? "—" : fmtScore(y)}` });
  }
  for (const k of new Set([...Object.keys(a.spectrumPositions), ...Object.keys(b.spectrumPositions)])) {
    const [x, y] = [a.spectrumPositions[k]?.[0], b.spectrumPositions[k]?.[0]];
    if (x === y) continue;
    const [qid, o] = k.split("|");
    if (!qa.has(qid) && x === undefined) continue;
    out.push({ section: "Espectro político", text: `${qlabel(qid)} · "${olabel(qid, o)}": ${x ?? "—"} → ${y ?? "—"}` });
  }
  for (const label of Object.keys(b.terms)) if (a.terms[label] !== b.terms[label]) out.push({ section: "Régua", text: `Seta de ${label}: ${fmtAt(a.terms[label])} → ${fmtAt(b.terms[label])}` });
  for (const id of Object.keys(b.candidates)) if (a.candidates[id] !== b.candidates[id]) out.push({ section: "Régua", text: `${CANDIDATE_SHORT[id] ?? id} na régua: ${fmtAt(a.candidates[id])} → ${fmtAt(b.candidates[id])}` });
  for (const label of Object.keys(b.ideologyBounds)) if (a.ideologyBounds[label] !== b.ideologyBounds[label]) out.push({ section: "Régua", text: `Fim do trecho de ${label}: ${fmtAt(a.ideologyBounds[label])} → ${fmtAt(b.ideologyBounds[label])}` });
  if (a.rightSideFrom !== b.rightSideFrom) out.push({ section: "Régua", text: `Linha divisória Lula | Flávio: ${fmtAt(a.rightSideFrom)} → ${fmtAt(b.rightSideFrom)}` });
  out.push(...diffContent(contentOf(a), contentOf(b), qlabel));
  return out;
}

/** Próximo id livre para pergunta nova (q54, q55…); ids nunca são reaproveitados. */
export function nextQuestionId(cfg: LiveConfig): string {
  const max = Math.max(53, ...cfg.questions.map((q) => Number(q.id.slice(1)) || 0));
  return `q${String(max + 1).padStart(2, "0")}`;
}

/** Monta as alternativas de uma pergunta nova (com "Não sei" no fim). */
export function buildOptions(qid: string, labels: string[]): QuestionOption[] {
  const all = [...labels.map((l) => l.trim()), "Não sei"];
  return all.map((label, i) => ({ id: `${qid}-o${i + 1}`, label, order: i + 1, normalizedValue: label === "Não sei" ? 0 : null, isNoOpinion: label === "Não sei" }));
}

/** Contagens do questionário em uso (para os textos do site). */
export function questionnaireCounts() {
  const topics = TOPICS.filter((t) => QUESTIONS.some((q) => q.topicId === t.id)).length;
  return { questions: QUESTIONS.length, topics };
}

const PAGE_NAMES: Record<string, string> = { home: "Página inicial", startCta: "Chamada para começar", footer: "Rodapé", comoFunciona: "Como funciona", metodologia: "Metodologia", report: "Relatório" };
const same = sameJson;

function diffContent(a: SiteContent, b: SiteContent, qlabel: (id: string) => string): ChangeItem[] {
  const out: ChangeItem[] = [];
  const T = (text: string) => out.push({ section: "Textos do site", text });
  for (const k of Object.keys(b.pages) as (keyof SiteTexts)[]) if (!same(a.pages[k], b.pages[k])) T(`${PAGE_NAMES[k] ?? k}: texto alterado`);
  for (const k of new Set([...Object.keys(a.profiles), ...Object.keys(b.profiles)])) if (!same(a.profiles[k], b.profiles[k])) T(`Perfil ideológico ${k}: texto alterado`);
  if (!same(a.spectrumIntro, b.spectrumIntro) || !same(a.spectrumComparison, b.spectrumComparison)) T("Explicação geral do espectro: texto alterado");
  for (const s of b.spectrumSections) if (!same(a.spectrumSections.find((x) => x.id === s.id), s)) T(`Card "${s.title}": texto alterado`);
  for (const k of new Set([...Object.keys(a.history), ...Object.keys(b.history)])) if (!same(a.history[k], b.history[k])) T(`Contexto histórico de ${k}: alterado`);
  for (const v of b.candidateViews) if (!same(a.candidateViews.find((x) => x.candidateId === v.candidateId), v)) T(`Visão ${CANDIDATE_SHORT[v.candidateId] ?? v.candidateId}: texto alterado`);
  for (const p of b.candidateProfiles) if (!same(a.candidateProfiles.find((x) => x.candidateId === p.candidateId), p)) T(`Currículo de ${CANDIDATE_SHORT[p.candidateId] ?? p.candidateId}: alterado`);
  const F = (text: string) => out.push({ section: "Fontes e links", text });
  const sa = a.sources ?? [], sb = b.sources ?? [];
  for (const x of sb) { const old = sa.find((y) => y.id === x.id); if (!old) F(`Nova fonte: ${x.name}`); else if (!same(old, x)) F(`Fonte "${x.name}": ${old.url !== x.url || old.documentUrl !== x.documentUrl ? "link alterado" : "texto alterado"}`); }
  for (const x of sa) if (!sb.some((y) => y.id === x.id)) F(`Fonte removida: ${x.name}`);
  const P = (text: string) => out.push({ section: "Revisão de posições", text });
  for (const id of new Set([...Object.keys(a.positions ?? {}), ...Object.keys(b.positions ?? {})])) {
    const [x, y] = [a.positions?.[id] ?? {}, b.positions?.[id] ?? {}];
    if (same(x, y)) continue;
    const [qid, cid] = [id.split("|")[0], id.split("|")[1]];
    const who = `${qid && cid ? `${qlabel(qid)} · ${CANDIDATE_SHORT[cid] ?? cid}` : id}`;
    if (x.direction !== y.direction) P(`${who}: direção ${x.direction ?? "(banco)"} → ${y.direction ?? "(banco)"}`);
    if (x.reviewStatus !== y.reviewStatus) P(`${who}: status ${x.reviewStatus ?? "(banco)"} → ${y.reviewStatus ?? "(banco)"}`);
    if (x.closestOptionId !== y.closestOptionId) P(`${who}: alternativa mais próxima alterada`);
    if (x.summary !== y.summary) P(`${who}: resumo alterado`);
  }
  for (const id of new Set([...Object.keys(a.evidence ?? {}), ...Object.keys(b.evidence ?? {})])) if (!same(a.evidence?.[id], b.evidence?.[id])) P(`Evidência ${id}: texto ou link alterado`);
  return out;
}

// ---------------------------------------------------------------------------
// Alcance de um pedido ("enviar para aprovação" de um item só)
// ---------------------------------------------------------------------------
export type Scope =
  | { kind: "question"; id: string }
  | { kind: "scores"; questionId: string }
  | { kind: "bands"; questionId: string }
  | { kind: "ruler" }
  | { kind: "content"; path: (string | number)[] }
  | { kind: "position"; key: string }
  | { kind: "evidence"; id: string };

const pick = <T,>(rec: Record<string, T>, prefix: string) => Object.fromEntries(Object.entries(rec).filter(([k]) => k.startsWith(prefix)));
const getPath = (root: unknown, path: (string | number)[]) => path.reduce<unknown>((n, k) => (n == null ? n : (n as Record<string | number, unknown>)[k]), root);

/** A parte da configuração que um item ocupa (para comparar rascunho × no ar). */
export function extractScope(cfg: LiveConfig, scope: Scope): unknown {
  const c = contentOf(cfg);
  switch (scope.kind) {
    case "question": return { q: cfg.questions.find((q) => q.id === scope.id) ?? null, archived: cfg.archived.includes(scope.id), s: pick(cfg.optionScores, `${scope.id}|`), b: pick(cfg.spectrumPositions, `${scope.id}|`) };
    case "scores": return pick(cfg.optionScores, `${scope.questionId}|`);
    case "bands": return pick(cfg.spectrumPositions, `${scope.questionId}|`);
    case "ruler": return { t: cfg.terms, c: cfg.candidates, i: cfg.ideologyBounds, r: cfg.rightSideFrom };
    case "content": return getPath(c, scope.path) ?? null;
    case "position": return c.positions?.[scope.key] ?? null;
    case "evidence": return c.evidence?.[scope.id] ?? null;
  }
}

export const scopeChanged = (a: LiveConfig, b: LiveConfig, scope: Scope) => !sameJson(extractScope(a, scope), extractScope(b, scope));

/** Cópia de `base` com a parte `scope` trazida de `src`. */
export function applyScope(base: LiveConfig, src: LiveConfig, scope: Scope): LiveConfig {
  const out: LiveConfig = clone(base);
  const replacePrefix = <T,>(rec: Record<string, T>, from: Record<string, T>, prefix: string) => {
    for (const k of Object.keys(rec)) if (k.startsWith(prefix)) delete rec[k];
    Object.assign(rec, clone(pick(from, prefix)));
  };
  switch (scope.kind) {
    case "question": {
      const q = src.questions.find((x) => x.id === scope.id);
      const i = out.questions.findIndex((x) => x.id === scope.id);
      if (q && i >= 0) out.questions[i] = clone(q); else if (q) out.questions.push(clone(q)); else if (i >= 0) out.questions.splice(i, 1);
      out.archived = out.archived.filter((x) => x !== scope.id).concat(src.archived.includes(scope.id) ? [scope.id] : []);
      replacePrefix(out.optionScores, src.optionScores, `${scope.id}|`);
      replacePrefix(out.spectrumPositions, src.spectrumPositions, `${scope.id}|`);
      break;
    }
    case "scores": replacePrefix(out.optionScores, src.optionScores, `${scope.questionId}|`); break;
    case "bands": replacePrefix(out.spectrumPositions, src.spectrumPositions, `${scope.questionId}|`); break;
    case "ruler": out.terms = clone(src.terms); out.candidates = clone(src.candidates); out.ideologyBounds = clone(src.ideologyBounds); out.rightSideFrom = src.rightSideFrom; break;
    case "content": {
      out.content = clone(contentOf(out));
      const value = clone(getPath(contentOf(src), scope.path));
      const parent = getPath(out.content, scope.path.slice(0, -1)) as Record<string | number, unknown>;
      parent[scope.path[scope.path.length - 1]] = value;
      break;
    }
    case "position": {
      out.content = clone(contentOf(out));
      const v = contentOf(src).positions?.[scope.key];
      if (v) out.content.positions[scope.key] = clone(v); else delete out.content.positions[scope.key];
      break;
    }
    case "evidence": {
      out.content = clone(contentOf(out));
      const v = contentOf(src).evidence?.[scope.id];
      if (v) out.content.evidence[scope.id] = clone(v); else delete out.content.evidence[scope.id];
      break;
    }
  }
  return out;
}

export function describeScope(scope: Scope, numbers: Record<string, number> = {}): string {
  switch (scope.kind) {
    case "question": return `Pergunta ${numbers[scope.id] ?? scope.id}`;
    case "scores": return `Notas da pergunta ${numbers[scope.questionId] ?? scope.questionId}`;
    case "bands": return `Faixas da pergunta ${numbers[scope.questionId] ?? scope.questionId}`;
    case "ruler": return "Régua";
    case "content": return `Texto: ${scope.path.join(" › ")}`;
    case "position": return `Posição ${scope.key.replace("|", " · ")}`;
    case "evidence": return `Evidência ${scope.id}`;
  }
}
