"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { discardItemAction } from "@/app/admin/publicar/actions";
import type { Scope } from "@/lib/live-config";

/** Etiqueta discreta abaixo de um item editado: está no rascunho; desfazer (com confirmação na própria etiqueta). */
export function DraftTag({ scope, changed }: { scope: Scope; changed: boolean; what?: string }) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [busy, start] = useTransition();
  if (!changed) return null;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs print:hidden">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4e5] px-2.5 py-1 font-semibold text-[#9a3412] ring-1 ring-[#f5c27a]">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />alterado
      </span>
      {asking ? (
        <>
          <span className="text-ink-2">Voltar ao que está no ar?</span>
          <button type="button" disabled={busy} onClick={() => start(async () => { await discardItemAction(scope); setAsking(false); router.refresh(); })} className="rounded-lg bg-[#9b1c1c] px-2.5 py-1 font-bold text-white">Desfazer</button>
          <button type="button" onClick={() => setAsking(false)} className="px-1 font-semibold text-ink-3 hover:text-ink">Cancelar</button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => setAsking(true)} className="font-semibold text-ink-3 hover:text-[#9b1c1c]">desfazer</button>
          <Link href="/admin/rascunho" className="font-semibold text-purple-strong hover:underline">revisar e publicar →</Link>
        </>
      )}
    </p>
  );
}
