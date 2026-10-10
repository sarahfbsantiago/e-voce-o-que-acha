import { RULER_WIDTHS, SPECTRUM_BANDS } from "@/data/political-spectrum";
import { SPECTRUM_TERMS } from "@/data/spectrum-terms";
import type { LiveConfig } from "@/lib/live-config";

const TOTAL = RULER_WIDTHS.reduce((n, w) => n + w, 0);
/** Ponto (0 a 8) → % no desenho, com as larguras da régua do relatório. */
export function rulerPctOf(at: number): number {
  const i = Math.min(7, Math.max(0, Math.floor(at)));
  return ((RULER_WIDTHS.slice(0, i).reduce((s, w) => s + w, 0) + (at - i) * RULER_WIDTHS[i]) / TOTAL) * 100;
}

/** Régua compacta (só leitura) de uma configuração: faixas, pontos das correntes, candidatos e linha divisória. */
export function MiniRuler({ cfg, label, highlight = false }: { cfg: LiveConfig; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ring-1 ${highlight ? "bg-purple-soft/40 ring-purple/30" : "bg-paper/60 ring-line"}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">{label}</p>
      <div className="overflow-x-auto">
        <div className="relative mt-6 min-w-[560px] pb-9">
          {Object.entries(cfg.candidates).map(([id, at]) => (
            <span key={id} className={`absolute -top-5 -translate-x-1/2 rounded px-1.5 text-[10px] font-bold text-white ${id === "lula" ? "bg-[#6d3fc4]" : "bg-[#2f9a5d]"}`} style={{ left: `${rulerPctOf(at)}%` }}>{id === "lula" ? "Lula" : "Flávio"}</span>
          ))}
          <div className="flex h-3 overflow-hidden rounded-full">
            {SPECTRUM_BANDS.map((b, i) => <span key={b.label} style={{ background: b.color, flexGrow: RULER_WIDTHS[i], flexBasis: 0 }} />)}
          </div>
          <span aria-hidden="true" className="absolute -top-1 h-5 w-0.5 bg-ink" style={{ left: `${rulerPctOf(cfg.rightSideFrom)}%` }} />
          {SPECTRUM_TERMS.map((t, i) => (
            <span key={t.label} className="absolute top-4 -translate-x-1/2 text-center" style={{ left: `${rulerPctOf(cfg.terms[t.label] ?? t.at)}%` }}>
              <span className="mx-auto block h-2 w-2 rounded-full bg-ink-3" />
              <span className={`block whitespace-nowrap text-[9px] text-ink-2 ${i % 2 ? "mt-3" : ""}`} style={{ transform: i === 0 ? "translateX(calc(50% - 4px))" : i === SPECTRUM_TERMS.length - 1 ? "translateX(calc(-50% + 4px))" : undefined }}>{t.label.split(" ")[0]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
