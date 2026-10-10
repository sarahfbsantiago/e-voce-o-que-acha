"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { discardItemAction, submitItemAction } from "@/app/admin/publicar/actions";
import type { Scope } from "@/lib/live-config";

const NAME_KEY = "vd-admin-nome";

/** Botão "Enviar para aprovação" logo abaixo de um item editado: envia só aquela mudança como pedido. */
export function SubmitItem({ scope, changed, what }: { scope: Scope; changed: boolean; what: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ id?: number; error?: string } | null>(null);
  const [pending, start] = useTransition();
  if (result?.id) return <p className="mt-2 rounded-lg bg-mint-soft px-3 py-2 text-xs font-semibold text-mint-strong">✓ Enviado para aprovação: <Link className="underline" href={`/admin/publicar/${result.id}`}>pedido #{result.id}</Link></p>;
  if (!changed) return null;
  return (
    <div className="mt-2 rounded-xl bg-[#fff4e5] p-2.5 ring-1 ring-[#f5c27a] print:hidden">
      {!open ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#7a4a00]">{what}: salvo no rascunho (ainda não enviado)</span>
          <button type="button" disabled={pending} onClick={() => { if (window.confirm("Desfazer este ajuste? Ele volta a ficar igual ao que está no site.")) start(async () => { await discardItemAction(scope); router.refresh(); }); }} className="ml-auto rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line hover:text-[#9b1c1c]">Desfazer este ajuste</button>
          <button type="button" onClick={() => { try { setName(localStorage.getItem(NAME_KEY) ?? ""); } catch {} setOpen(true); }} className="rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white shadow-sm">Enviar para aprovação</button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" maxLength={60} className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="O que mudou e por quê" maxLength={600} className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm" />
          <button type="button" disabled={pending || name.trim().length < 2 || note.trim().length < 3}
            onClick={() => start(async () => { try { localStorage.setItem(NAME_KEY, name.trim()); } catch {} const r = await submitItemAction(scope, name, note); setResult(r); if (r.id) router.refresh(); })}
            className="rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Enviando…" : "Enviar"}</button>
          {result?.error ? <p className="text-xs font-semibold text-[#9b1c1c] sm:col-span-3">{result.error}</p> : null}
        </div>
      )}
    </div>
  );
}
