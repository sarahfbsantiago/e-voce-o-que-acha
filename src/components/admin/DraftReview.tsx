"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { discardItemAction } from "@/app/admin/publicar/actions";
import { publishSelectedAction, sendSelectedAction } from "@/app/admin/rascunho/actions";
import type { Scope } from "@/lib/live-config";
import { useAdminName } from "./useAdminName";

export interface DraftItemView { id: string; scope: Scope; group: string; title: string; color: string; preview: ReactNode }

/** Aba Rascunho: lista das mudanças (todas marcadas), desfazer item a item e publicar as marcadas com motivo e código. */
export function DraftReview({ items, needsCode, blocked }: { items: DraftItemView[]; needsCode: boolean; blocked: string | null }) {
  const router = useRouter();
  const [picked, setPicked] = useState<Set<string>>(() => new Set(items.map((i) => i.id)));
  const [asking, setAsking] = useState<string | null>(null);
  const [author, setAuthor, remember] = useAdminName();
  const [reason, setReason] = useState("");
  const [code, setCode] = useState("");
  const [busy, start] = useTransition();
  // depois de desfazer um item a lista muda: itens novos entram marcados
  const ids = items.map((i) => i.id).join("\n");
  const [seen, setSeen] = useState(ids);
  if (seen !== ids) {
    setSeen(ids);
    const before = new Set(seen.split("\n"));
    setPicked((p) => new Set(items.map((i) => i.id).filter((id) => p.has(id) || !before.has(id))));
  }

  const chosen = items.filter((i) => picked.has(i.id));
  const ready = chosen.length > 0 && author.trim().length >= 2 && reason.trim().length >= 3 && !blocked;
  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const field = "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-ink-2">
          <input type="checkbox" className="h-4 w-4 accent-purple" checked={chosen.length === items.length} onChange={(e) => setPicked(new Set(e.target.checked ? items.map((i) => i.id) : []))} />
          Selecionar tudo
        </label>
        <span className="text-ink-3">{chosen.length} de {items.length} marcadas</span>
      </div>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className={`admin-lift overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 transition-opacity ${picked.has(it.id) ? "ring-purple/30" : "opacity-60 ring-black/5"}`}>
            <div className="flex flex-wrap items-center gap-3 px-4 py-3">
              <input type="checkbox" aria-label={`Incluir ${it.title}`} className="h-5 w-5 accent-purple" checked={picked.has(it.id)} onChange={() => toggle(it.id)} />
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: it.color }}>{it.group}</span>
              <b className="min-w-0 flex-1 text-sm text-ink">{it.title}</b>
              {asking === it.id ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="text-ink-2">Voltar ao que está no ar?</span>
                  <button type="button" disabled={busy} onClick={() => start(async () => { await discardItemAction(it.scope); setAsking(null); router.refresh(); })} className="rounded-lg bg-[#9b1c1c] px-2.5 py-1 font-bold text-white">Desfazer</button>
                  <button type="button" onClick={() => setAsking(null)} className="rounded-lg px-2 py-1 font-semibold text-ink-3 hover:text-ink">Cancelar</button>
                </span>
              ) : (
                <button type="button" onClick={() => setAsking(it.id)} className="text-xs font-semibold text-ink-3 hover:text-[#9b1c1c]">desfazer</button>
              )}
            </div>
            <details open={items.length <= 4} className="group border-t border-line">
              <summary className="cursor-pointer list-none px-4 py-2 text-xs font-semibold text-purple-strong">
                <span className="group-open:hidden">Ver antes × depois</span><span className="hidden group-open:inline">Esconder antes × depois</span>
              </summary>
              <div className="px-4 pb-4">{it.preview}</div>
            </details>
          </li>
        ))}
      </ul>

      <form action={publishSelectedAction} onSubmit={remember} className="sticky bottom-3 z-20 space-y-3 rounded-2xl bg-surface/95 p-4 shadow-lg ring-1 ring-purple/20 backdrop-blur">
        <input type="hidden" name="items" value={JSON.stringify(chosen.map((i) => i.scope))} />
        {blocked ? <p className="rounded-lg bg-[#fde8e8] px-3 py-2 text-xs font-semibold text-[#9b1c1c]">Corrija antes de publicar: {blocked}</p> : null}
        <div className="grid gap-3 md:grid-cols-[160px_1fr_auto_auto] md:items-center">
          <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60} placeholder="Seu nome" aria-label="Seu nome" className={field} />
          <input name="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="Motivo (ex.: ajuste de texto)" aria-label="Motivo" className={field} />
          {needsCode ? (
            <input name="code" value={code} inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="código" aria-label="Código do Google Authenticator"
              onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setCode(v); if (v.length === 6 && ready) { remember(); e.target.form?.requestSubmit(); } }}
              className={`${field} w-32 text-center text-base font-bold tracking-[0.2em]`} />
          ) : null}
          <button disabled={!ready || (needsCode && code.length !== 6)} className="admin-press min-h-11 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:from-line disabled:to-line disabled:text-ink-3">
            Publicar {chosen.length === 1 ? "1 mudança" : `${chosen.length} mudanças`}
          </button>
        </div>
        <p className="text-right text-xs text-ink-3">
          ou <button formAction={sendSelectedAction} disabled={!ready} className="font-semibold text-purple-strong underline disabled:cursor-not-allowed disabled:opacity-40">enviar para outra pessoa aprovar</button>
        </p>
      </form>
    </div>
  );
}
