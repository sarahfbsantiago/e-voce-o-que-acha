"use client";

import { useState } from "react";
import { approveAction } from "@/app/admin/publicar/actions";

/** Confirmação da publicação: nome, motivo, "Estou ciente", frase digitada e código do Google Authenticator. */
export function PublishForm({ phrase, requestId, rollback, needsCode, danger, defaultReason }: { phrase: string; requestId: number; rollback: number | null; needsCode: boolean; danger: boolean; defaultReason: string }) {
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState(defaultReason);
  const [aware, setAware] = useState(false);
  const [typed, setTyped] = useState("");
  const [code, setCode] = useState("");
  const readyWithoutCode = author.trim().length >= 2 && reason.trim().length >= 3 && aware && typed.trim().toLowerCase() === phrase.toLowerCase();
  const ok = author.trim().length >= 2 && reason.trim().length >= 3 && aware && typed.trim().toLowerCase() === phrase.toLowerCase() && (!needsCode || code.length === 6);
  const field = "mt-1.5 w-full rounded-xl border border-line bg-paper/50 px-3 py-2.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";
  return (
    <form action={approveAction} className="space-y-4">
      <input type="hidden" name="request" value={requestId} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">Seu nome (quem aprova)
          <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60} required className={field} placeholder="Ex.: Sarah" />
        </label>
        <label className="block text-sm font-semibold text-ink">Motivo da mudança
          <input name="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} required className={field} placeholder="Ex.: revisão das notas de segurança" />
        </label>
      </div>
      <label className={`flex items-start gap-3 rounded-xl p-3 text-sm ring-1 ${danger ? "bg-[#fff4e5] ring-[#f5c27a]" : "bg-paper/70 ring-line"}`}>
        <input type="checkbox" name="aware" checked={aware} onChange={(e) => setAware(e.target.checked)} className="mt-0.5 h-5 w-5 accent-purple" />
        <span><b className="text-ink">Estou ciente</b> de que, ao publicar, o site, o relatório de todas as pessoas e as métricas do painel passam a usar esta versão, com o impacto mostrado acima.</span>
      </label>
      <label className="block text-sm font-semibold text-ink">Para confirmar, digite <code className="rounded bg-[#fde8e8] px-1.5 py-0.5 font-bold text-[#9b1c1c]">{phrase}</code>
        <input name="phrase" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className={field} />
      </label>
      {needsCode ? (
        <label className="block text-sm font-semibold text-ink">Código do Google Authenticator <span className="font-normal text-ink-3">{readyWithoutCode ? "(ao digitar os 6 números, publica sozinho)" : "(preencha os campos acima antes)"}</span>
          <input name="code" value={code} onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(v);
            // com tudo preenchido, o 6º dígito já publica (sem clicar no botão)
            if (v.length === 6 && readyWithoutCode) e.target.form?.requestSubmit();
          }} inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="000000" className={`${field} max-w-48 text-center text-xl font-bold tracking-[0.3em]`} />
        </label>
      ) : null}
      <button disabled={!ok} className="min-h-11 w-full rounded-xl bg-gradient-to-r from-[#9b1c1c] to-[#dc2626] px-4 py-2.5 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:from-line disabled:to-line disabled:text-ink-3 md:w-auto">
        {rollback ? `Aprovar e voltar para a v${rollback}` : "Aprovar e publicar no site"}
      </button>
    </form>
  );
}
