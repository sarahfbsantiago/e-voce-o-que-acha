"use client";

import { useState } from "react";
import { approveAction } from "@/app/admin/publicar/actions";
import { useAdminName } from "./useAdminName";

/** Confirmação da aprovação de um pedido: nome (lembrado), motivo e código do Google Authenticator. */
export function PublishForm({ requestId, rollback, needsCode, defaultReason }: { requestId: number; rollback: number | null; needsCode: boolean; defaultReason: string }) {
  const [author, setAuthor, remember] = useAdminName();
  const [reason, setReason] = useState(defaultReason);
  const [code, setCode] = useState("");
  const ready = author.trim().length >= 2 && reason.trim().length >= 3;
  const ok = ready && (!needsCode || code.length === 6);
  const field = "mt-1.5 w-full rounded-xl border border-line bg-paper/50 px-3 py-2.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";
  return (
    <form action={approveAction} onSubmit={remember} className="space-y-4">
      <input type="hidden" name="request" value={requestId} />
      <div className="grid gap-4 md:grid-cols-[200px_1fr_auto] md:items-end">
        <label className="block text-sm font-semibold text-ink">Seu nome
          <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60} required className={field} placeholder="Ex.: Sarah" />
        </label>
        <label className="block text-sm font-semibold text-ink">Motivo
          <input name="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} required className={field} placeholder="Ex.: revisão das notas de segurança" />
        </label>
        {needsCode ? (
          <label className="block text-sm font-semibold text-ink">Código
            <input name="code" value={code} onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(v);
              if (v.length === 6 && ready) e.target.form?.requestSubmit();
            }} inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="000000" className={`${field} w-36 text-center text-lg font-bold tracking-[0.25em]`} />
          </label>
        ) : null}
      </div>
      <button disabled={!ok} className="admin-press min-h-11 w-full rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2.5 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:from-line disabled:to-line disabled:text-ink-3 md:w-auto">
        {rollback ? `Aprovar e voltar para a v${rollback}` : "Aprovar e publicar"}
      </button>
    </form>
  );
}
