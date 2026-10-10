"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { discardDraft, getWorkingConfig, saveDraft } from "@/lib/live-config-server";
import { CANDIDATE_IDS, bandKey, buildOptions, nextQuestionId, scoreKey, type LiveConfig } from "@/lib/live-config";
import { SPECTRUM_BANDS, type SpectrumBandLabel } from "@/data/political-spectrum";

/**
 * Ações do admin que mexem no RASCUNHO (nada vai para o site até publicar em /admin/publicar).
 * Toda ação confere a sessão do admin.
 */
async function edit(fn: (cfg: LiveConfig, live: LiveConfig) => void): Promise<void> {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { cfg, published } = await getWorkingConfig();
  const next: LiveConfig = JSON.parse(JSON.stringify(cfg));
  fn(next, published.cfg);
  await saveDraft(next, published.version);
  revalidatePath("/admin", "layout");
}

const REASON = "Revisão humana (admin)";
const bandOk = (b: string): b is SpectrumBandLabel => SPECTRUM_BANDS.some((x) => x.label === b);
const scoreOk = (n: number) => [0, 0.5, 1].includes(n);

export async function setScoreAction(questionId: string, candidateId: string, optionId: string, value: number) {
  if (!scoreOk(value) || !CANDIDATE_IDS.includes(candidateId as (typeof CANDIDATE_IDS)[number])) return;
  await edit((c) => { c.optionScores[scoreKey(questionId, candidateId, optionId)] = [value, REASON]; });
}

export async function setBandAction(questionId: string, optionId: string, band: string) {
  if (!bandOk(band)) return;
  await edit((c) => { c.spectrumPositions[bandKey(questionId, optionId)] = [band, REASON]; });
}

export async function setRulerAction(ruler: Pick<LiveConfig, "terms" | "candidates" | "ideologyBounds" | "rightSideFrom">) {
  const r2 = (n: number) => Math.round(n * 100) / 100;
  await edit((c) => {
    for (const k of Object.keys(c.terms)) if (typeof ruler.terms[k] === "number") c.terms[k] = r2(ruler.terms[k]);
    for (const k of Object.keys(c.candidates)) if (typeof ruler.candidates[k] === "number") c.candidates[k] = r2(ruler.candidates[k]);
    for (const k of Object.keys(c.ideologyBounds)) if (k in ruler.ideologyBounds) c.ideologyBounds[k] = ruler.ideologyBounds[k] === null ? null : r2(Number(ruler.ideologyBounds[k]));
    if (typeof ruler.rightSideFrom === "number") c.rightSideFrom = r2(ruler.rightSideFrom);
  });
}

export async function updateQuestionAction(questionId: string, data: { text: string; example: string; labels: Record<string, string> }) {
  await edit((c) => {
    const q = c.questions.find((x) => x.id === questionId);
    if (!q) return;
    q.text = data.text.trim().slice(0, 600);
    const ex = data.example.trim().slice(0, 1200);
    if (ex) q.example = ex; else delete q.example;
    for (const o of q.options) if (!o.isNoOpinion && data.labels[o.id] !== undefined) o.label = data.labels[o.id].trim().slice(0, 200) || o.label;
  });
}

type NewOption = { label: string; lula: number; flavio: number; band: string };

function setOptionValues(c: LiveConfig, qid: string, optionId: string, o: NewOption) {
  c.optionScores[scoreKey(qid, "lula", optionId)] = [scoreOk(o.lula) ? o.lula : 0, REASON];
  c.optionScores[scoreKey(qid, "flavio-bolsonaro", optionId)] = [scoreOk(o.flavio) ? o.flavio : 0, REASON];
  if (bandOk(o.band)) c.spectrumPositions[bandKey(qid, optionId)] = [o.band, REASON];
}

export async function addOptionAction(questionId: string, o: NewOption) {
  if (!o.label.trim()) return;
  await edit((c) => {
    const q = c.questions.find((x) => x.id === questionId);
    if (!q) return;
    const used = q.options.map((x) => Number(x.id.split("-o").pop()) || 0);
    const id = `${q.id}-o${Math.max(...used) + 1}`;
    const noOp = q.options.findIndex((x) => x.isNoOpinion);
    const opt = { id, label: o.label.trim().slice(0, 200), order: 0, normalizedValue: null, isNoOpinion: false };
    if (noOp >= 0) q.options.splice(noOp, 0, opt); else q.options.push(opt);
    q.options.forEach((x, i) => { x.order = i + 1; });
    setOptionValues(c, q.id, id, o);
  });
}

export async function createQuestionAction(data: { topicId: string; text: string; example: string; options: NewOption[] }) {
  const opts = data.options.filter((o) => o.label.trim());
  if (!data.text.trim() || opts.length < 2) return;
  await edit((c) => {
    const id = nextQuestionId(c);
    const order = Math.max(0, ...c.questions.filter((q) => q.topicId === data.topicId).map((q) => q.order)) + 1;
    const options = buildOptions(id, opts.map((o) => o.label.slice(0, 200)));
    c.questions.push({ id, topicId: data.topicId, order, text: data.text.trim().slice(0, 600), kind: "SINGLE_CHOICE", options, ...(data.example.trim() ? { example: data.example.trim().slice(0, 1200) } : {}) });
    options.filter((o) => !o.isNoOpinion).forEach((o, i) => setOptionValues(c, id, o.id, opts[i]));
  });
}

export async function archiveQuestionAction(questionId: string) {
  await edit((c, live) => {
    if (!live.questions.some((q) => q.id === questionId)) {
      // pergunta que só existe no rascunho: some de vez (nunca foi ao ar)
      c.questions = c.questions.filter((q) => q.id !== questionId);
      for (const k of Object.keys(c.optionScores)) if (k.startsWith(`${questionId}|`)) delete c.optionScores[k];
      for (const k of Object.keys(c.spectrumPositions)) if (k.startsWith(`${questionId}|`)) delete c.spectrumPositions[k];
      return;
    }
    if (!c.archived.includes(questionId)) c.archived.push(questionId);
  });
}

export async function restoreQuestionAction(questionId: string) {
  await edit((c) => { c.archived = c.archived.filter((x) => x !== questionId); });
}

export async function discardDraftAction() {
  if (!(await isAdminSession())) redirect("/admin/login");
  await discardDraft();
  revalidatePath("/admin", "layout");
  redirect("/admin/publicar?descartado=1");
}
