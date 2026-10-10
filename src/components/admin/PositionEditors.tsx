"use client";

import { sameJson } from "@/lib/live-config";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setEvidenceAction, setPositionAction } from "@/app/admin/config-actions";

const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";
const DIRS: [string, string][] = [["SUPPORTS", "Apoia"], ["PARTIALLY_SUPPORTS", "Apoia em parte"], ["NEUTRAL", "Neutro / manter"], ["PARTIALLY_OPPOSES", "Opõe-se em parte"], ["OPPOSES", "Opõe-se"], ["UNCLEAR", "Não documentado"]];
const STATUS: [string, string][] = [["PUBLISHED", "Publicada (entra no relatório)"], ["DRAFT", "Rascunho (fora do relatório)"], ["REJECTED", "Rejeitada"]];

/** Edita resumo, direção, alternativa mais próxima e status de uma posição (no rascunho). */
export function PositionEditor({ posKey, value, options }: { posKey: string; value: { summary: string; direction: string; closestOptionId: string | null; reviewStatus: string }; options: { id: string; label: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const dirty = !sameJson(v, value);
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-purple-strong ring-1 ring-purple/30 hover:bg-purple-soft print:hidden">Editar posição</button>;
  return (
    <div className="space-y-2 rounded-xl bg-surface p-3 ring-1 ring-line print:hidden">
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-[11px] font-semibold text-ink-2">Status<select className={`${input} mt-0.5`} value={v.reviewStatus} onChange={(e) => setV({ ...v, reviewStatus: e.target.value })}>{STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="text-[11px] font-semibold text-ink-2">Direção<select className={`${input} mt-0.5`} value={v.direction} onChange={(e) => setV({ ...v, direction: e.target.value })}>{DIRS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="text-[11px] font-semibold text-ink-2">Alternativa mais próxima<select className={`${input} mt-0.5`} value={v.closestOptionId ?? ""} onChange={(e) => setV({ ...v, closestOptionId: e.target.value || null })}><option value="">—</option>{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
      </div>
      <label className="block text-[11px] font-semibold text-ink-2">Resumo da posição<textarea className={`${input} mt-0.5`} rows={3} value={v.summary} onChange={(e) => setV({ ...v, summary: e.target.value })} /></label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={!dirty || pending} onClick={() => start(async () => { const changed = Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== value[k as keyof typeof value])); await setPositionAction(posKey, changed); setSaved(true); router.refresh(); })} className="rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Salvando…" : "Salvar no rascunho"}</button>
        <button type="button" onClick={() => { setV(value); setOpen(false); }} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 ring-1 ring-line">Fechar</button>
        {saved ? <span className="text-xs font-bold text-mint-strong">✓ Salvo no rascunho</span> : null}
      </div>
    </div>
  );
}

/** Edita título, resumo, trecho original e link de uma evidência (no rascunho). */
export function EvidenceEditor({ id, value }: { id: string; value: { title: string; summary: string; originalExcerpt: string; link: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const dirty = !sameJson(v, value);
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="mt-1 text-[11px] font-bold text-purple-strong underline print:hidden">Editar evidência</button>;
  return (
    <div className="mt-2 space-y-2 rounded-lg bg-surface p-2.5 ring-1 ring-line print:hidden">
      <label className="block text-[11px] font-semibold text-ink-2">Título<input className={`${input} mt-0.5`} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></label>
      <label className="block text-[11px] font-semibold text-ink-2">Resumo<textarea className={`${input} mt-0.5`} rows={2} value={v.summary} onChange={(e) => setV({ ...v, summary: e.target.value })} /></label>
      <label className="block text-[11px] font-semibold text-ink-2">Trecho original<textarea className={`${input} mt-0.5`} rows={2} value={v.originalExcerpt} onChange={(e) => setV({ ...v, originalExcerpt: e.target.value })} /></label>
      <label className="block text-[11px] font-semibold text-ink-2">Link do documento<input className={`${input} mt-0.5`} value={v.link} onChange={(e) => setV({ ...v, link: e.target.value })} placeholder="https://" /></label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={!dirty || pending} onClick={() => start(async () => { await setEvidenceAction(id, v); setSaved(true); router.refresh(); })} className="rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1 text-[11px] font-bold text-white disabled:opacity-40">Salvar no rascunho</button>
        {v.link ? <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-purple underline">testar link ↗</a> : null}
        <button type="button" onClick={() => { setV(value); setOpen(false); }} className="text-[11px] font-semibold text-ink-3">Fechar</button>
        {saved ? <span className="text-[11px] font-bold text-mint-strong">✓ Salvo</span> : null}
      </div>
    </div>
  );
}
