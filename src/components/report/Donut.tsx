"use client";

import { useEffect, useState } from "react";

export type Slice = { id: string; label: string; value: number; color: string; detail?: string };

/**
 * Pizza (donut) animada reutilizável: fatias proporcionais a `value`, desenhadas em cascata,
 * destaque no hover/toque e legenda. Mesmo visual para o perfil da pessoa e dos candidatos.
 */
export function Donut({ slices, caption, hint, centerUnit = "%", size = 220, compact = false }: { slices: Slice[]; caption: string; hint?: string; centerUnit?: string; size?: number; compact?: boolean }) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  // da maior para a menor fatia, no anel e na legenda
  const ordered = [...slices].sort((a, b) => b.value - a.value);
  const total = ordered.reduce((a, s) => a + s.value, 0);
  if (total === 0) {
    return (
      <figure className="card p-5">
        <figcaption className="text-sm font-semibold">{caption}</figcaption>
        <p className="mt-2 text-sm text-ink-2">Sem dados suficientes para montar o gráfico.</p>
      </figure>
    );
  }
  const pcts = ordered.map((s) => (s.value / total) * 100);
  const offsets = pcts.map((_, i) => pcts.slice(0, i).reduce((a, b) => a + b, 0));
  const items = ordered.map((s, i) => ({ s, i, pct: pcts[i], offset: offsets[i] }));
  const current = items.find((x) => x.s.id === active) ?? null;
  const biggest = [...items].sort((a, b) => b.pct - a.pct)[0];
  const shown = current ?? biggest;

  return (
    <figure className={compact ? "card p-4" : "card p-5 md:p-6"}>
      <figcaption className={compact ? "text-xs font-semibold" : "text-sm font-semibold"}>{caption}</figcaption>
      {hint ? <p className="mt-0.5 text-[11px] text-ink-3 print:hidden">{hint}</p> : null}
      <div className={compact ? "mt-3 grid items-center gap-3 grid-cols-[auto_minmax(0,1fr)]" : "mt-5 grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)]"}>
        <div className="relative mx-auto max-w-full" style={{ width: size }}>
          <svg viewBox="0 0 100 100" className="block w-full" role="img" aria-label={caption}>
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 3" className="pie-ring text-line-strong" />
            <g transform="rotate(-90 50 50)">
              {items.map((x) => {
                const isActive = active === x.s.id;
                const len = Math.max(0, x.pct - 0.6);
                return (
                  <circle
                    key={x.s.id}
                    cx="50" cy="50" r="34" fill="none" pathLength={100}
                    stroke={x.s.color} strokeWidth={isActive ? 20 : 16}
                    strokeDasharray={ready ? `${len} ${100 - len}` : "0 100"}
                    strokeDashoffset={-x.offset}
                    style={{ transition: `stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${x.i * 60}ms, stroke-width 0.2s`, opacity: active && !isActive ? 0.45 : 1 }}
                    onMouseEnter={() => setActive(x.s.id)} onMouseLeave={() => setActive(null)}
                    onClick={() => setActive(isActive ? null : x.s.id)}
                  >
                    <title>{`${x.s.label}: ${Math.round(x.pct)}%${x.s.detail ? ` · ${x.s.detail}` : ""}`}</title>
                  </circle>
                );
              })}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div className={compact ? "max-w-[56px]" : "max-w-[110px]"}>
              <p className={compact ? "text-base font-bold leading-none" : "text-2xl font-bold leading-none"} style={{ color: shown.s.color }}>{Math.round(shown.pct)}{centerUnit}</p>
              {compact ? null : <p className="mt-1 text-[11px] leading-tight text-ink-2">{shown.s.label}</p>}
            </div>
          </div>
        </div>
        <ul className={compact ? "grid gap-0.5 text-[11px]" : "grid gap-1 text-sm"} aria-label="Legenda">
          {items.map((x) => (
            <li
              key={x.s.id}
              title={`${x.s.label}${x.s.detail ? ` — ${x.s.detail}` : ""}`}
              className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 rounded-lg transition-colors ${compact ? "px-1 py-0.5" : "px-2 py-1"} ${active === x.s.id ? "bg-paper" : "hover:bg-paper"}`}
              onMouseEnter={() => setActive(x.s.id)} onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === x.s.id ? null : x.s.id)}
            >
              <span aria-hidden="true" className={`swatch ${compact ? "mt-1 h-2.5 w-2.5 rounded-sm" : "mt-1 h-3 w-3 rounded-sm"}`} style={{ background: x.s.color }} />
              <span className="min-w-0 text-ink-2 leading-snug">
                <span className="block">{x.s.label}</span>
                {!compact && x.s.detail ? <span className="block text-[11px] text-ink-3">{x.s.detail}</span> : null}
              </span>
              <span className={compact ? "whitespace-nowrap text-[11px] font-semibold text-ink" : "whitespace-nowrap text-sm font-semibold text-ink"}>{Math.round(x.pct)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
