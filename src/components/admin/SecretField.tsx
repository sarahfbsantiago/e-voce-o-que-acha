"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** Chave escondida (●●●●) com olhinho para mostrar e botão de copiar. */
export function SecretField({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const grouped = value.replace(/(.{4})/g, "$1 ").trim();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-paper p-3 ring-1 ring-line">
      <code className="min-w-0 flex-1 break-all font-mono text-base font-bold tracking-wider text-ink">{show ? grouped : grouped.replace(/[A-Z2-7]/g, "●")}</code>
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Esconder chave" : "Mostrar chave"} className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-lg ring-1 ring-line hover:bg-purple-soft"><Icon name={show ? "eyeOff" : "eye"} className="h-5 w-5 text-ink-2" /></button>
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }} className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-2 text-xs font-bold text-white"><span className="inline-flex items-center gap-1"><Icon name={copied ? "check" : "copy"} className="h-4 w-4" />{copied ? "Copiada" : "Copiar"}</span></button>
    </div>
  );
}
