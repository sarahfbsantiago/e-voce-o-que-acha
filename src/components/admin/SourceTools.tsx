"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addSourceAction, removeSourceAction } from "@/app/admin/config-actions";

const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm";

export function AddSource() {
  const router = useRouter();
  const [d, setD] = useState({ name: "", institution: "", url: "", purpose: "" });
  const [pending, start] = useTransition();
  const ok = d.name.trim().length >= 3 && /^https?:\/\//.test(d.url.trim());
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <input className={input} placeholder="Nome da fonte" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
      <input className={input} placeholder="Instituição" value={d.institution} onChange={(e) => setD({ ...d, institution: e.target.value })} />
      <input className={`${input} md:col-span-2`} placeholder="Link (https://…)" value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} />
      <textarea className={`${input} md:col-span-2`} rows={2} placeholder="Para que serve" value={d.purpose} onChange={(e) => setD({ ...d, purpose: e.target.value })} />
      <div className="flex gap-2 md:col-span-2">
        <button type="button" disabled={!ok || pending} onClick={() => start(async () => { await addSourceAction(d); setD({ name: "", institution: "", url: "", purpose: "" }); router.refresh(); })} className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">Adicionar no rascunho</button>
        {d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="self-center text-xs font-semibold text-purple underline">testar link ↗</a> : null}
      </div>
    </div>
  );
}

export function RemoveSource({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return <button type="button" disabled={pending} onClick={() => { if (window.confirm("Remover esta fonte do rascunho?")) start(async () => { await removeSourceAction(id); router.refresh(); }); }} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-[#9b1c1c] ring-1 ring-[#f5b5b5]">Remover fonte</button>;
}
