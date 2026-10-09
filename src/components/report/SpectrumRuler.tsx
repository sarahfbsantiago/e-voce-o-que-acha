import { SPECTRUM_BANDS, CANDIDATE_SPECTRUM, personSpectrumPosition, bandAt } from "@/data/political-spectrum";

const pct = (at: number) => (at / SPECTRUM_BANDS.length) * 100;
/** Rótulo centrado na seta, mas encostado na borda quando a seta está perto das pontas. */
/** O mesmo, para um rótulo que já está centrado na seta. */
const shift = (n: number) => (n < 15 ? "translateX(calc(50% - 12px))" : n > 85 ? "translateX(calc(-50% + 12px))" : "none");
const anchor = (n: number) => (n < 15 ? "translateX(-12px)" : n > 85 ? "translateX(calc(-100% + 12px))" : "translateX(-50%)");

/**
 * Régua do espectro político: os candidatos com setas por cima e a pessoa (a partir do resultado do relatório) por baixo.
 * As cores dos candidatos seguem a barra de porcentagem logo acima.
 */
export function SpectrumRuler({ totals }: { totals: { c: { id: string; name: string }; themes: number }[] }) {
  const person = personSpectrumPosition(totals.map((t) => ({ candidateId: t.c.id, themes: t.themes })));
  const candidates = totals.map((t, i) => ({ ...t, spot: CANDIDATE_SPECTRUM[t.c.id], tone: i === 0 ? "accent" : "mint" })).filter((t) => t.spot);
  if (person === null || candidates.length === 0) return null;
  const band = bandAt(person);

  return (
    <div className="mt-6 print-keep" aria-labelledby="espectro">
      <h4 id="espectro" className="text-sm font-semibold">Onde seu resultado fica no espectro político</h4>
      <p className="mt-0.5 text-xs text-ink-3">Sua posição fica entre os dois candidatos, conforme os temas em que cada um ficou mais próximo de você.</p>

      <div className="mt-4 px-1" role="img" aria-label={`${candidates.map((t) => `${t.c.name}: ${t.spot.label}`).join("; ")}; você: ${band}`}>
        {/* candidatos, com seta para baixo */}
        <div className="relative h-14">
          {candidates.map((t) => (
            <div key={t.c.id} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${pct(t.spot.at)}%`, transform: "translateX(-50%)" }}>
              <span style={{ transform: shift(pct(t.spot.at)) }} className={`whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white ${t.tone === "accent" ? "bg-accent" : "bg-mint"}`}>{t.c.name.split(" ")[0]}</span>
              <span aria-hidden="true" className={`h-4 w-0.5 ${t.tone === "accent" ? "bg-accent" : "bg-mint"}`} />
              <span aria-hidden="true" className={`h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent ${t.tone === "accent" ? "border-t-accent" : "border-t-mint"}`} />
            </div>
          ))}
        </div>

        {/* régua */}
        <div className="mt-1 flex h-2.5 w-full overflow-hidden rounded-full">
          {SPECTRUM_BANDS.map((b) => <span key={b.label} className="h-full flex-1" style={{ background: b.color }} />)}
        </div>
        <div className="mt-1.5 grid grid-cols-8 gap-0.5">
          {SPECTRUM_BANDS.map((b) => (
            <span key={b.label} className={`text-center text-[9px] leading-tight sm:text-[11px] ${b.label === band ? "font-bold text-ink" : "text-ink-3"}`}>{b.label}</span>
          ))}
        </div>

        {/* a pessoa, com seta para cima */}
        <div className="relative mt-2 h-14">
          <span aria-hidden="true" className="absolute top-0 h-0 w-0 border-x-[6px] border-b-[8px] border-x-transparent border-b-purple" style={{ left: `${pct(person)}%`, transform: "translateX(-50%)" }} />
          <span aria-hidden="true" className="absolute top-2 h-4 w-0.5 bg-purple" style={{ left: `${pct(person)}%`, transform: "translateX(-50%)" }} />
          <span className="absolute top-6 whitespace-nowrap rounded-md bg-purple px-2 py-0.5 text-xs font-bold text-white shadow-sm" style={{ left: `${pct(person)}%`, transform: anchor(pct(person)) }}>Você · {band}</span>
        </div>
      </div>

      <ul className="mt-1 space-y-0.5 text-[11px] text-ink-2">
        {candidates.map((t) => <li key={t.c.id}><span className="font-semibold text-ink">{t.c.name}:</span> {t.spot.label}</li>)}
      </ul>
    </div>
  );
}
