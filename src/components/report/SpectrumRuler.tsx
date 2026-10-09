"use client";

import { useEffect, useRef, useState } from "react";
import { SPECTRUM_BANDS, CANDIDATE_SPECTRUM, personSpectrum, bandAt } from "@/data/political-spectrum";
import { SPECTRUM_COMPARISON, SPECTRUM_CORRECTIONS, SPECTRUM_INTRO, SPECTRUM_SECTIONS, SPECTRUM_TERMS, type SpectrumBlock } from "@/data/spectrum-terms";

const N = SPECTRUM_BANDS.length;
const pct = (at: number) => (at / N) * 100;
/** Rótulo centrado na seta, mas encostado na borda quando a seta está perto das pontas. */
const anchor = (n: number) => (n < 10 ? "translateX(-12px)" : n > 90 ? "translateX(calc(-100% + 12px))" : "translateX(-50%)");

type Totals = { c: { id: string; name: string }; themes: number }[];

/** Termos agrupados pela posição (ex.: dois termos no meio da centro-esquerda). */
function groupTerms(side: "above" | "below") {
  const groups = new Map<number, typeof SPECTRUM_TERMS>();
  for (const t of SPECTRUM_TERMS.filter((x) => x.side === side)) groups.set(t.at, [...(groups.get(t.at) ?? []), t]);
  return [...groups.entries()];
}

export function SpectrumBlocks({ blocks }: { blocks: SpectrumBlock[] }) {
  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-ink-2">
      {blocks.map((b, i) => {
        if (b.t === "h") return <p key={i} className="pt-1 font-semibold text-ink">{b.text}</p>;
        if (b.t === "p") return <p key={i}>{b.lead ? <span className="font-semibold text-ink">{b.lead} </span> : null}{b.text}</p>;
        if (b.t === "ol") return <ol key={i} className="list-decimal space-y-1 pl-5">{b.items.map((x) => <li key={x}>{x}</li>)}</ol>;
        if (b.t === "ul") return <ul key={i} className="list-disc space-y-1 pl-5">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
        if (b.t === "link") return <a key={i} href={b.href} target="_blank" rel="noreferrer" className="inline-block font-medium text-purple underline underline-offset-4">{b.label} ↗</a>;
        return (
          <div key={i} className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper"><tr>{b.head.map((h) => <th key={h} className="px-3 py-2 font-semibold text-ink">{h}</th>)}</tr></thead>
              <tbody>{b.rows.map(([a, d]) => <tr key={a} className="border-t border-line"><td className="px-3 py-2 font-medium text-ink">{a}</td><td className="px-3 py-2">{d}</td></tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Régua do espectro político: termos com setas (cada um abre a explicação), candidatos por cima e
 * a pessoa por baixo, na posição que as respostas dela apontam (independente dos candidatos).
 * No fim, de qual candidato ela ficou mais próxima nos temas.
 * No celular, a régua fica em pé.
 */
export function SpectrumRuler({ totals, answers }: { totals: Totals; answers: { questionId: string; optionIds: string[] }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /** Classe de entrada: espera invisível até a régua aparecer na tela. */
  const anim = (cls: string) => (shown ? cls : "spectrum-wait");
  const delay = (s: number) => ({ animationDelay: `${s}s` });
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (openId && !el.open) el.showModal();
    if (!openId && el.open) el.close();
  }, [openId]);

  const person = personSpectrum(answers);
  const candidates = totals.map((t, i) => ({ ...t, spot: CANDIDATE_SPECTRUM[t.c.id], tone: i === 0 ? "bg-accent" : "bg-mint", border: i === 0 ? "border-t-accent" : "border-t-mint" })).filter((t) => t.spot);
  if (!person || candidates.length === 0) return null;
  // "mais próxima de": continua sendo quem ganhou mais temas (tabela de notas dos candidatos)
  const top = Math.max(...candidates.map((t) => t.themes));
  const leaders = candidates.filter((t) => t.themes === top);
  const closest = top > 0 && leaders.length === 1 ? leaders[0] : null;
  const youLabel = `Você · ${person.ideology}`;
  const section = openId === "intro" ? null : SPECTRUM_SECTIONS.find((s) => s.id === openId) ?? null;

  const termButton = (label: string, sectionId: string, at: number) => (
    <button key={label} type="button" onClick={() => setOpenId(sectionId)} title={`Ler sobre ${label.toLowerCase()}`} style={delay(0.25 + at * 0.08)} className={`${anim("spectrum-pop")} group inline-flex items-center gap-1 rounded-full border border-purple/50 bg-purple-soft px-2 py-1 text-center text-[11px] font-semibold leading-tight text-purple-strong shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple hover:bg-purple hover:text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-purple print:shadow-none`}>
      <span aria-hidden="true" className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-purple text-[9px] font-bold text-white group-hover:bg-white group-hover:text-purple">i</span>
      {label}
    </button>
  );

  // celular: linhas de cima para baixo; meio de faixa = n,5 e divisas = inteiros
  const slots: { at: number; band: number | null }[] = [];
  for (let i = 0; i < N; i++) {
    if (i > 0) slots.push({ at: i, band: null });
    slots.push({ at: i + 0.5, band: i });
  }

  return (
    <div ref={rootRef} className="mt-6 print-keep" aria-labelledby="espectro">
      <h4 id="espectro" className="text-sm font-semibold">Onde você fica no espectro ideológico político</h4>
      <p className="mt-0.5 text-xs text-ink-3 print:hidden">Toque em uma ideologia para ler sobre ela. <button type="button" onClick={() => setOpenId("intro")} className="font-medium text-purple underline underline-offset-4">Entenda o espectro político →</button></p>

      {/* computador: régua deitada */}
      <div className="mt-4 hidden px-1 md:block" role="img" aria-label={`${candidates.map((t) => `${t.c.name}: ${t.spot.label}`).join("; ")}; você: ${person.ideology}`}>
        <div className="relative h-24">
          {groupTerms("above").map(([at, ts]) => (
            <div key={at} className="absolute bottom-0 flex w-[11%] flex-col items-center gap-1" style={{ left: `${pct(at)}%`, transform: "translateX(-50%)" }}>
              {ts.map((t) => termButton(t.label, t.section, t.at))}
              <span aria-hidden="true" className="h-3 w-px bg-ink-3" />
              <span aria-hidden="true" className="h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-ink-3" />
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-9">
          {candidates.map((t) => (
            <div key={t.c.id} className="absolute bottom-0" style={{ left: `${pct(t.spot.at)}%`, transform: "translateX(-50%)" }}>
              <div className={`${anim("spectrum-drop")} flex flex-col items-center`} style={delay(1 + t.spot.at * 0.05)}>
              <span className={`whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white ${t.tone}`}>{t.c.name.split(" ")[0]}</span>
              <span aria-hidden="true" className={`h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent ${t.border}`} />
              </div>
            </div>
          ))}
        </div>
        <div className={`${anim("spectrum-grow")} flex h-2.5 w-full overflow-hidden rounded-full`}>
          {SPECTRUM_BANDS.map((b) => <span key={b.label} className="h-full flex-1" style={{ background: b.color }} />)}
        </div>
        <div className="mt-1.5 grid grid-cols-8 gap-0.5">
          {SPECTRUM_BANDS.map((b) => <span key={b.label} className="text-center text-[11px] leading-tight text-ink-3">{b.label}</span>)}
        </div>
        <div className="relative mt-1 h-12">
          <div className={`spectrum-slide absolute top-0 ${shown ? "" : "opacity-0"}`} style={{ left: `${shown ? pct(person.at) : 0}%` }}>
            <div className="spectrum-nudge">
              <span aria-hidden="true" className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[8px] border-x-transparent border-b-purple" />
              <span aria-hidden="true" className="absolute top-2 h-3 w-0.5 -translate-x-1/2 bg-purple" />
            </div>
            <span className="spectrum-pulse absolute top-5 whitespace-nowrap rounded-md bg-purple px-2 py-0.5 text-xs font-bold text-white shadow-sm" style={{ transform: anchor(pct(person.at)) }}>{youLabel}</span>
          </div>
        </div>
        <div className="relative h-16">
          {groupTerms("below").map(([at, ts]) => (
            <div key={at} className="absolute top-0 flex w-[11%] flex-col items-center gap-1" style={{ left: `${pct(at)}%`, transform: "translateX(-50%)" }}>
              <span aria-hidden="true" className="h-0 w-0 border-x-[4px] border-b-[5px] border-x-transparent border-b-ink-3" />
              <span aria-hidden="true" className="h-3 w-px bg-ink-3" />
              {ts.map((t) => termButton(t.label, t.section, t.at))}
            </div>
          ))}
        </div>
      </div>

      {/* celular: régua em pé */}
      <ol className="mt-4 md:hidden">
        {slots.map(({ at, band }) => {
          const terms = SPECTRUM_TERMS.filter((t) => t.at === at);
          const cands = candidates.filter((t) => t.spot.at === at);
          const you = band === null ? person.at === at : !Number.isInteger(person.at) && Math.floor(person.at) === band;
          if (band === null && !terms.length && !cands.length && !you) return null;
          return (
            <li key={at} className={`${anim("spectrum-pop")} flex gap-3`} style={delay(at * 0.07)}>
              <span aria-hidden="true" className={`w-2.5 shrink-0 ${band === null ? "bg-line-strong" : ""} ${band === 0 ? "rounded-t-full" : ""} ${band === N - 1 ? "rounded-b-full" : ""}`} style={band !== null ? { background: SPECTRUM_BANDS[band].color } : undefined} />
              <div className={`min-w-0 flex-1 ${band === null ? "py-1.5" : "py-2"}`}>
                <p className={band === null ? "text-[11px] italic text-ink-3" : "text-xs font-semibold text-ink"}>{bandAt(at)}</p>
                {terms.length || cands.length || you ? (
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {terms.map((t) => termButton(t.label, t.section, t.at))}
                    {cands.map((t) => <span key={t.c.id} className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white ${t.tone}`}>◀ {t.c.name.split(" ")[0]}</span>)}
                    {you ? <span className="spectrum-pulse rounded-md bg-purple px-2 py-0.5 text-[11px] font-bold text-white">◀ {youLabel}</span> : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <ul className="mt-3 space-y-0.5 text-[11px] text-ink-2">
        {candidates.map((t) => <li key={t.c.id}><span className="font-semibold text-ink">{t.c.name}:</span> {t.spot.label}</li>)}
      </ul>
      <p style={delay(1.8)} className={`${anim("spectrum-pop")} mt-3 rounded-lg border border-purple/30 bg-purple-soft px-3 py-2 text-sm text-ink`}>
        {closest ? <>Sua ideologia está mais próxima de: <span className="font-bold text-purple-strong">{closest.c.name}</span></> : <>Sua ideologia ficou equivalente entre os dois candidatos.</>}
      </p>

      <dialog ref={dialogRef} className="modal" aria-labelledby="espectro-detalhe" onClose={() => setOpenId(null)} onClick={(e) => { if (e.target === dialogRef.current) setOpenId(null); }}>
        {openId ? (
          <div className="modal-panel">
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
              <h4 id="espectro-detalhe" className="min-w-0 flex-1 text-base font-bold">{section ? section.title : "Espectro político"}</h4>
              <button type="button" onClick={() => setOpenId(null)} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper"><span aria-hidden="true" className="text-xl leading-none">×</span></button>
            </header>
            <div className="modal-body space-y-6 px-5 py-4">
              {section ? (
                <>
                  <SpectrumBlocks blocks={section.blocks} />
                  <button type="button" onClick={() => setOpenId("intro")} className="text-sm font-semibold text-purple underline underline-offset-4">Entenda o espectro político →</button>
                </>
              ) : (
                <>
                  <SpectrumBlocks blocks={SPECTRUM_INTRO} />
                  {[SPECTRUM_COMPARISON, SPECTRUM_CORRECTIONS].map((s) => (
                    <section key={s.id} className="space-y-2">
                      <h5 className="text-base font-bold">{s.title}</h5>
                      <SpectrumBlocks blocks={s.blocks} />
                    </section>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
