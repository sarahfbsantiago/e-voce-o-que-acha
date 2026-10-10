"use client";

import { useEffect, useState } from "react";

const TAB_KEY = "vd-admin-aba";

/**
 * Relógio da sessão do admin (30 minutos) e regras de saída:
 * acabou o tempo, a página foi atualizada ou a aba foi fechada e reaberta → volta para o login e pede o código.
 */
export function AdminSessionClock({ expiresAt }: { expiresAt: number }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    let tabOk = false;
    try {
      if (url.searchParams.get("entrou") === "1") {
        sessionStorage.setItem(TAB_KEY, String(expiresAt));
        url.searchParams.delete("entrou");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
        tabOk = true;
      } else {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        tabOk = sessionStorage.getItem(TAB_KEY) === String(expiresAt) && nav?.type !== "reload";
      }
    } catch { tabOk = false; }
    if (!tabOk) { window.location.replace("/admin/sair?motivo=recarregou"); return; }

    const tick = () => {
      const ms = expiresAt - Date.now();
      if (ms <= 0) { window.location.replace("/admin/sair?motivo=tempo"); return; }
      setLeft(ms);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  if (left === null) return null;
  const min = Math.floor(left / 60000);
  const sec = Math.floor((left % 60000) / 1000);
  const low = left < 5 * 60 * 1000;
  return (
    <span title="Tempo restante da sessão do admin" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums ring-1 ${low ? "bg-[#fde8e8] text-[#9b1c1c] ring-[#f5b5b5]" : "bg-paper text-ink-2 ring-line"}`}>
      <span aria-hidden="true">⏱</span>{String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
      <span className="sr-only">restantes na sessão</span>
    </span>
  );
}
