"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setBandAction, setScoreAction } from "@/app/admin/config-actions";

const PILL: Record<string, string> = { "1": "bg-mint text-white", "0.5": "bg-gold text-[#3d2f05]", "0": "bg-line text-ink-2" };

/** Nota editável (0, 0,5 ou 1): muda no rascunho na hora; só vai para o site ao publicar. */
export function ScoreSelect({ questionId, candidateId, optionId, value, published, reviewed }: { questionId: string; candidateId: string; optionId: string; value: number; published: number; reviewed: boolean }) {
  const router = useRouter();
  const [v, setV] = useState(value);
  const [pending, start] = useTransition();
  const draft = v !== published;
  return (
    <span className="relative inline-block">
      <select aria-label="Nota" value={String(v)} disabled={pending}
        onChange={(e) => { const n = Number(e.target.value); setV(n); start(async () => { await setScoreAction(questionId, candidateId, optionId, n); router.refresh(); }); }}
        className={`h-7 min-w-14 cursor-pointer appearance-none rounded-full px-3 text-center text-xs font-bold tabular-nums outline-none ${PILL[String(v)]} ${reviewed ? "ring-2 ring-purple ring-offset-1" : ""} ${draft ? "ring-2 ring-[#f97316] ring-offset-1" : ""} ${pending ? "opacity-60" : ""}`}>
        <option value="1">1</option><option value="0.5">0,5</option><option value="0">0</option>
      </select>
      {draft ? <span title={`No ar: ${String(published).replace(".", ",")}`} className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#f97316] ring-2 ring-surface" /> : null}
    </span>
  );
}

/** Faixa editável de uma alternativa na régua. */
export function BandSelect({ questionId, optionId, value, published, bands, width = "w-36" }: { questionId: string; optionId: string; value: string; published: string; bands: { label: string; color: string }[]; width?: string }) {
  const router = useRouter();
  const [v, setV] = useState(value);
  const [pending, start] = useTransition();
  const color = bands.find((b) => b.label === v)?.color ?? "#ccc";
  const draft = v !== published;
  return (
    <span className="relative inline-block">
      <select aria-label="Faixa na régua" value={v} disabled={pending}
        onChange={(e) => { const b = e.target.value; setV(b); start(async () => { await setBandAction(questionId, optionId, b); router.refresh(); }); }}
        className={`${width} cursor-pointer appearance-none rounded-full px-2.5 py-1 text-center text-xs font-bold text-ink outline-none ${draft ? "ring-2 ring-[#f97316] ring-offset-1" : ""} ${pending ? "opacity-60" : ""}`}
        style={{ background: `${color}33` }}>
        {bands.map((b) => <option key={b.label} value={b.label}>{b.label}</option>)}
      </select>
      {draft ? <span title={`No ar: ${published}`} className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#f97316] ring-2 ring-surface" /> : null}
    </span>
  );
}
