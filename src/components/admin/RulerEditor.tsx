"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { setRulerAction } from "@/app/admin/config-actions";
import { RULER_WIDTHS, SPECTRUM_BANDS } from "@/data/political-spectrum";
import { validateConfig, type LiveConfig } from "@/lib/live-config";

type Ruler = Pick<LiveConfig, "terms" | "candidates" | "ideologyBounds" | "rightSideFrom">;
type DragKey = { kind: "term" | "cand" | "bound" | "split"; id: string } | null;

const TOTAL = RULER_WIDTHS.reduce((n, w) => n + w, 0);
const toPct = (at: number) => {
  const i = Math.min(7, Math.max(0, Math.floor(at)));
  return ((RULER_WIDTHS.slice(0, i).reduce((s, w) => s + w, 0) + (at - i) * RULER_WIDTHS[i]) / TOTAL) * 100;
};
const fromPct = (pct: number) => {
  let x = (Math.min(100, Math.max(0, pct)) / 100) * TOTAL;
  for (let i = 0; i < 8; i++) {
    if (x <= RULER_WIDTHS[i] || i === 7) return Math.round((i + Math.min(1, x / RULER_WIDTHS[i])) * 100) / 100;
    x -= RULER_WIDTHS[i];
  }
  return 8;
};
const fmt = (n: number | null) => (n === null ? "fim" : String(n).replace(".", ","));

/**
 * Editor da régua (análise geral): arraste as setas das correntes, Lula, Flávio, a linha divisória e os limites
 * dos trechos das ideologias. "Salvar no rascunho" guarda; só vai para o site ao publicar.
 */
export function RulerEditor({ initial, published, order, ideologies, base }: { initial: Ruler; published: Ruler; order: string[]; ideologies: string[]; base: LiveConfig }) {
  const router = useRouter();
  const [r, setR] = useState<Ruler>(initial);
  const [drag, setDrag] = useState<DragKey>(null);
  const [saving, start] = useTransition();
  const box = useRef<HTMLDivElement>(null);
  const errors = useMemo(() => validateConfig({ ...base, ...r }).filter((e) => /régua|cruzar|trecho|linha|Lula|Flávio|seta/i.test(e)), [base, r]);
  const dirty = JSON.stringify(r) !== JSON.stringify(initial);
  const changedFromLive = JSON.stringify(r) !== JSON.stringify(published);

  const move = (clientX: number) => {
    if (!drag || !box.current) return;
    const rect = box.current.getBoundingClientRect();
    const at = fromPct(((clientX - rect.left) / rect.width) * 100);
    setR((prev) => {
      const n: Ruler = JSON.parse(JSON.stringify(prev));
      if (drag.kind === "term") n.terms[drag.id] = at;
      if (drag.kind === "cand") n.candidates[drag.id] = at;
      if (drag.kind === "bound") n.ideologyBounds[drag.id] = at;
      if (drag.kind === "split") n.rightSideFrom = at;
      return n;
    });
  };
  const handle = (k: NonNullable<DragKey>) => ({
    onPointerDown: (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setDrag(k); },
    onKeyDown: (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 0.1 : 0.01;
      const d = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0;
      if (!d) return;
      e.preventDefault();
      setR((prev) => {
        const n: Ruler = JSON.parse(JSON.stringify(prev));
        const clamp = (x: number) => Math.round(Math.min(8, Math.max(0, x)) * 100) / 100;
        if (k.kind === "term") n.terms[k.id] = clamp(n.terms[k.id] + d);
        if (k.kind === "cand") n.candidates[k.id] = clamp(n.candidates[k.id] + d);
        if (k.kind === "bound") n.ideologyBounds[k.id] = clamp((n.ideologyBounds[k.id] ?? 8) + d);
        if (k.kind === "split") n.rightSideFrom = clamp(n.rightSideFrom + d);
        return n;
      });
    },
    tabIndex: 0,
    role: "slider",
  });

  const bounds = ideologies.map((label, i) => ({ label, from: i === 0 ? 0 : (r.ideologyBounds[ideologies[i - 1]] ?? 8), to: r.ideologyBounds[label] ?? 8 }));
  const bandColor = (at: number) => SPECTRUM_BANDS[Math.min(7, Math.max(0, Math.floor(at)))].color;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
        <span className="rounded-full bg-paper px-2.5 py-1 ring-1 ring-line">Arraste com o mouse ou o dedo · setas do teclado ajustam 0,01 (Shift: 0,1)</span>
        {changedFromLive ? <span className="rounded-full bg-[#fff4e5] px-2.5 py-1 font-semibold text-[#7a4a00] ring-1 ring-[#f5c27a]">diferente da versão no ar</span> : null}
      </div>
      <div className="overflow-x-auto pb-2">
        <div ref={box} className="relative mx-4 min-w-[720px] touch-none select-none" style={{ height: 340 }}
          onPointerMove={(e) => move(e.clientX)} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
          {/* candidatos */}
          {Object.entries(r.candidates).map(([id, at]) => (
            <button key={id} type="button" {...handle({ kind: "cand", id })} aria-label={`${id === "lula" ? "Lula" : "Flávio"}: ${fmt(at)}`}
              className={`absolute top-0 -translate-x-1/2 cursor-grab rounded-md px-2 py-1 text-xs font-bold text-white shadow active:cursor-grabbing ${id === "lula" ? "bg-[#6d3fc4]" : "bg-[#2f9a5d]"}`} style={{ left: `${toPct(at)}%` }}>
              {id === "lula" ? "Lula" : "Flávio"} <span className="opacity-80">{fmt(at)}</span>
            </button>
          ))}
          {/* linha divisória */}
          <div {...handle({ kind: "split", id: "split" })} aria-label={`Linha divisória: ${fmt(r.rightSideFrom)}`} className="absolute top-9 z-10 -translate-x-1/2 cursor-ew-resize" style={{ left: `${toPct(r.rightSideFrom)}%`, height: 240 }}>
            <div className="mx-auto h-full w-1 rounded bg-ink" />
            <span className="absolute -top-1 left-2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">divisa {fmt(r.rightSideFrom)}</span>
          </div>
          {/* lados */}
          <div className="absolute inset-x-0 top-10 flex h-6 text-[10px] font-bold">
            <div className="flex items-center justify-center rounded-l-lg bg-[#6d3fc4]/12 text-[#562f9f]" style={{ width: `${toPct(r.rightSideFrom)}%` }}>mais perto de Lula</div>
            <div className="flex flex-1 items-center justify-center rounded-r-lg bg-[#2f9a5d]/12 text-[#237a49]">mais perto de Flávio</div>
          </div>
          {/* faixas */}
          <div className="absolute inset-x-0 top-[72px] flex h-6 overflow-hidden rounded-lg">
            {SPECTRUM_BANDS.map((b, i) => <div key={b.label} className="flex items-center justify-center text-[9px] font-bold text-white" style={{ background: b.color, flexGrow: RULER_WIDTHS[i], flexBasis: 0 }}>{b.label}</div>)}
          </div>
          {/* setas das correntes */}
          {order.map((label, i) => {
            const at = r.terms[label];
            return (
              <div key={label} {...handle({ kind: "term", id: label })} aria-label={`${label}: ${fmt(at)}`} className="absolute -translate-x-1/2 cursor-grab text-center active:cursor-grabbing" style={{ left: `${toPct(at)}%`, top: 100 }}>
                <span className="mx-auto block h-3 w-3 rounded-full border-2 border-surface shadow" style={{ background: bandColor(at) }} />
                <span className="mx-auto block w-px bg-ink-3" style={{ height: [12, 40, 68][i % 3] }} />
                <span className="block whitespace-nowrap rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-bold text-ink shadow ring-1 ring-line" style={{ transform: i === 0 ? "translateX(calc(50% - 8px))" : i === order.length - 1 ? "translateX(calc(-50% + 8px))" : undefined }}>{label} <span className="font-normal text-ink-3">{fmt(at)}</span></span>
              </div>
            );
          })}
          {/* trechos das ideologias */}
          <div className="absolute inset-x-0" style={{ top: 268 }}>
            {bounds.map((b, i) => (
              <div key={b.label} className="absolute flex h-7 items-center justify-center border-r border-surface text-[10px] font-bold text-white" style={{ left: `${toPct(b.from)}%`, width: `${Math.max(0, toPct(b.to) - toPct(b.from))}%`, background: bandColor(r.terms[b.label] ?? b.from) }} title={b.label}>{i + 1}</div>
            ))}
            {ideologies.slice(0, -1).map((label) => (
              <div key={label} {...handle({ kind: "bound", id: label })} aria-label={`Fim do trecho de ${label}: ${fmt(r.ideologyBounds[label])}`} className="absolute top-[-4px] z-10 h-9 w-3 -translate-x-1/2 cursor-ew-resize rounded bg-ink/80 ring-2 ring-surface" style={{ left: `${toPct(r.ideologyBounds[label] ?? 8)}%` }} />
            ))}
            <p className="absolute left-0 top-9 text-[10px] text-ink-3">Trechos das ideologias (o que cai em cada trecho vira aquela ideologia). Arraste as barrinhas pretas.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
        {ideologies.map((label, i) => (
          <p key={label} className="flex items-center gap-1.5 rounded-lg bg-paper/60 px-2 py-1 ring-1 ring-line">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: bandColor(r.terms[label] ?? 0) }}>{i + 1}</span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <span className="tabular-nums text-ink-3">{fmt(bounds[i].from)}–{fmt(r.ideologyBounds[label])}</span>
          </p>
        ))}
      </div>

      {errors.length ? <ul className="list-disc space-y-0.5 rounded-xl bg-[#fde8e8] p-3 pl-7 text-xs font-semibold text-[#9b1c1c]">{errors.map((e) => <li key={e}>{e}</li>)}</ul> : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!dirty || saving || errors.length > 0} onClick={() => start(async () => { await setRulerAction(r); router.refresh(); })}
          className="min-h-10 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-40">{saving ? "Salvando…" : "Salvar no rascunho"}</button>
        <button type="button" disabled={!dirty} onClick={() => setR(initial)} className="min-h-10 rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink-2 ring-1 ring-line disabled:opacity-40">Desfazer edição</button>
        <button type="button" onClick={() => setR(published)} className="min-h-10 rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink-2 ring-1 ring-line">Voltar ao que está no ar</button>
      </div>
    </div>
  );
}
