"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { SPECTRUM_HISTORY, type SectionHistory } from "@/data/spectrum-history";
import { SPECTRUM_BANDS, CANDIDATE_SPECTRUM, RULER_WIDTHS, closestCandidateOnRuler, personSpectrum, rulerPct } from "@/data/political-spectrum";
import { SPECTRUM_COMPARISON, SPECTRUM_INTRO, SPECTRUM_SECTIONS, SPECTRUM_TERMS, type SpectrumBlock } from "@/data/spectrum-terms";

const pct = rulerPct;
const WIDTHS = RULER_WIDTHS;
/** Rótulo centrado na seta, mas encostado na borda quando a seta está perto das pontas. */
const anchor = (n: number) => (n < 10 ? "translateX(-12px)" : n > 90 ? "translateX(calc(-100% + 12px))" : "translateX(-50%)");

type Totals = { c: { id: string; name: string }; themes: number }[];


/** "Na história": personagens com foto, a história em poucas linhas e a linha do tempo, com cara de livro de história. */
function HistoryBook({ h }: { h: SectionHistory }) {
  return (
    <section className="space-y-4 rounded-xl border border-note-line bg-note p-4 shadow-inner" aria-label="Na história">
      <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-gold-strong">Na história</p>
      <div className={`grid gap-4 ${h.figures.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {h.figures.map((f) => (
          <figure key={f.slug} className="flex gap-3 rounded-lg bg-surface/70 p-2.5 shadow-sm ring-1 ring-note-line">
            <div className="shrink-0 self-start rotate-[-1.5deg] rounded-sm bg-white p-1 pb-3 shadow-md ring-1 ring-black/5">
              <Image src={`/historia/${f.slug}.jpg`} alt={`Retrato de ${f.name}`} width={96} height={124} className="h-[124px] w-24 object-cover grayscale-[35%] sepia-[25%]" />
            </div>
            <figcaption className="min-w-0 text-xs leading-relaxed text-ink-2">
              <span className="block font-serif text-sm font-bold text-ink">{f.name}</span>
              <span className="block text-[11px] text-ink-3">{f.years}</span>
              <span className="mt-1 block">{f.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="space-y-4 font-serif text-[15px] leading-relaxed text-ink">
        {h.chapters.map((c, i) => (
          <section key={c.title}>
            <h6 className="flex items-baseline gap-2 font-serif text-base font-bold text-ink"><span className="text-xs font-bold text-gold-strong">{String(i + 1).padStart(2, "0")}</span>{c.title}</h6>
            <p className={`mt-1 ${i === 0 ? "first-letter:float-left first-letter:mr-1.5 first-letter:font-serif first-letter:text-4xl first-letter:font-bold first-letter:leading-none first-letter:text-gold-strong" : ""}`}>{c.text}</p>
          </section>
        ))}
      </div>
      <div>
        <p className="font-serif text-sm font-bold text-ink">Linha do tempo</p>
        <ol className="mt-2 space-y-2 border-l-2 border-gold/60 pl-4">
          {h.timeline.map(([year, event]) => (
            <li key={year + event} className="relative text-sm text-ink-2">
              <span aria-hidden="true" className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-note bg-gold" />
              <span className="mr-2 font-serif font-bold text-ink">{year}</span>{event}
            </li>
          ))}
        </ol>
      </div>
      <p className="text-[10px] leading-snug text-ink-3">
        Fotos: {h.figures.map((f, i) => (
          <span key={f.slug}>{i ? " · " : ""}{f.name}, {f.credit.author}, {f.credit.license}, <a href={f.credit.page} target="_blank" rel="noreferrer" className="underline">Wikimedia Commons</a></span>
        ))}.
      </p>
    </section>
  );
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
 * No celular e no tablet, a régua fica em pé.
 */
export function SpectrumRuler({ totals, answers }: { totals: Totals; answers: { questionId: string; optionIds: string[] }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    // anima de novo toda vez que a régua volta a aparecer na tela
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    // no PDF (impressão), a régua aparece completa, sem depender da rolagem
    const onPrint = () => setShown(true);
    window.addEventListener("beforeprint", onPrint);
    return () => { io.disconnect(); window.removeEventListener("beforeprint", onPrint); };
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
  // "mais próxima de": o candidato mais perto da pessoa no desenho da régua
  const closestId = closestCandidateOnRuler(person.at, candidates.map((t) => t.c.id));
  const closest = candidates.find((t) => t.c.id === closestId) ?? null;
  const youLabel = `Você · ${person.ideology}`;
  const section = openId === "intro" ? null : SPECTRUM_SECTIONS.find((s) => s.id === openId) ?? null;

  const termButton = (label: string, sectionId: string, at: number, inline = false) => (
    <span key={label} className={`${anim("spectrum-pop")} inline-block`} style={delay(0.25 + at * 0.08)}>
      <button type="button" onClick={() => { setOpenTerm(label); setOpenId(sectionId); }} title={`Ler sobre ${label.toLowerCase()}`} className="spectrum-btn inline-flex items-center gap-1 rounded-xl px-1.5 py-1.5 lg:gap-1.5 lg:px-2.5 print:gap-0.5 print:px-1 print:py-1 print:text-[8.5px] text-left text-[11px] font-semibold leading-tight text-purple-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple">
        <span aria-hidden="true" className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-purple text-[9px] lg:h-4 lg:w-4 lg:text-[10px] font-bold text-white shadow-sm">i</span>
        <span className={inline ? "whitespace-nowrap" : "w-min"}>{label}</span>
      </button>
    </span>
  );


  return (
    <div ref={rootRef} className="mt-6 print-keep" aria-labelledby="espectro">
      <h4 id="espectro" className="text-sm font-semibold">Onde você fica no espectro ideológico político</h4>
      <p className="mt-0.5 text-xs text-ink-3 print:hidden">Toque em uma ideologia para ler sobre ela. <button type="button" onClick={() => setOpenId("intro")} className="font-medium text-purple underline underline-offset-4">Entenda o espectro político →</button></p>

      {/* computador: régua deitada */}
      <div className="mt-4 hidden px-1 lg:block print:block" role="img" aria-label={`${candidates.map((t) => `${t.c.name}: ${t.spot.label}`).join("; ")}; você: ${person.ideology}`}>
        {/* acima: botões espaçados, setas (retas ou inclinadas) até o ponto exato; candidatos logo acima da régua */}
        <div className="relative h-[160px]">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 160" preserveAspectRatio="none">
            {SPECTRUM_TERMS.filter((t) => t.side === "above").map((t) => (
              <line key={t.label} x1={t.chip} y1={98} x2={pct(t.at)} y2={153} className={`${anim("spectrum-pop")} stroke-ink-3`} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={delay(0.4 + t.at * 0.08)} />
            ))}
          </svg>
          {SPECTRUM_TERMS.filter((t) => t.side === "above").map((t) => (
            <span key={t.label}>
              <div className="absolute bottom-[62px]" style={{ left: `${t.chip}%`, transform: "translateX(-50%)" }}>{termButton(t.label, t.section, t.at)}</div>
              <span aria-hidden="true" className="absolute bottom-0 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[7px] border-x-transparent border-t-ink-3" style={{ left: `${pct(t.at)}%` }} />
            </span>
          ))}
          {candidates.map((t) => (
            <div key={t.c.id} className="absolute bottom-0 z-10" style={{ left: `${pct(t.spot.at)}%`, transform: "translateX(-50%)" }}>
              <div className={`${anim("spectrum-drop")} flex flex-col items-center`} style={delay(1 + t.spot.at * 0.05)}>
                <span className={`whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-sm ${t.tone}`}>{t.c.name.split(" ")[0]}</span>
                <span aria-hidden="true" className={`h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent ${t.border}`} />
              </div>
            </div>
          ))}
        </div>

        <div className={`${anim("spectrum-grow")} flex h-2.5 w-full overflow-hidden rounded-full`}>
          {SPECTRUM_BANDS.map((b, i) => <span key={b.label} className="h-full" style={{ background: b.color, flexGrow: WIDTHS[i], flexBasis: 0 }} />)}
        </div>

        {/* abaixo: nomes das faixas, você e os botões de baixo, com setas até o ponto exato */}
        <div className="relative h-[144px]">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 144" preserveAspectRatio="none">
            {SPECTRUM_TERMS.filter((t) => t.side === "below").map((t) => (
              <line key={t.label} x1={t.chip} y1={96} x2={pct(t.at)} y2={8} className={`${anim("spectrum-pop")} stroke-ink-3`} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={delay(0.4 + t.at * 0.08)} />
            ))}
          </svg>
          {SPECTRUM_TERMS.filter((t) => t.side === "below").map((t) => (
            <span key={t.label}>
              <span aria-hidden="true" className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[4px] border-b-[7px] border-x-transparent border-b-ink-3" style={{ left: `${pct(t.at)}%` }} />
              <div className="absolute top-[96px]" style={{ left: `${t.chip}%`, transform: "translateX(-50%)" }}>{termButton(t.label, t.section, t.at)}</div>
            </span>
          ))}
          <div className="relative mt-1.5 grid gap-0.5" style={{ gridTemplateColumns: WIDTHS.map((w) => `${w}fr`).join(" ") }}>
            {SPECTRUM_BANDS.map((b) => <span key={b.label} className="text-center text-[11px] leading-tight text-ink-3"><span className="rounded bg-surface/85 px-0.5">{b.label}</span></span>)}
          </div>
          <div className="absolute inset-x-0 top-9 z-10 hidden h-12 print:block">
            <div className="absolute top-0" style={{ left: `${pct(person.at)}%` }}>
              <span aria-hidden="true" className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[8px] border-x-transparent border-b-purple" />
              <span aria-hidden="true" className="absolute top-2 h-3 w-0.5 -translate-x-1/2 bg-purple" />
              <span className="absolute top-5 whitespace-nowrap rounded-md bg-purple px-2 py-0.5 text-xs font-bold text-white" style={{ transform: anchor(pct(person.at)) }}>{youLabel}</span>
            </div>
          </div>
          <div className="absolute inset-x-0 top-9 z-10 h-12 print:hidden">
            <div className={`spectrum-slide absolute top-0 ${shown ? "" : "opacity-0"}`} style={{ left: `${shown ? pct(person.at) : 0}%` }}>
              <div className="spectrum-nudge">
                <span aria-hidden="true" className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[8px] border-x-transparent border-b-purple" />
                <span aria-hidden="true" className="absolute top-2 h-3 w-0.5 -translate-x-1/2 bg-purple" />
              </div>
              <span className="spectrum-pulse absolute top-5 whitespace-nowrap rounded-md bg-purple px-2 py-0.5 text-xs font-bold text-white shadow-sm" style={{ transform: anchor(pct(person.at)) }}>{youLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* celular: régua em pé, com cada item numa linha própria e uma seta até o ponto exato */}
      {(() => {
        type Item = { key: string; at: number; node: ReactNode };
        const items: Item[] = [
          ...SPECTRUM_TERMS.map((t) => ({ key: t.label, at: t.at, node: termButton(t.label, t.section, t.at, true) })),
          ...candidates.map((t) => ({ key: t.c.id, at: t.spot.at + 0.001, node: <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${t.tone}`}>{t.c.name.split(" ")[0]}</span> })),
          { key: "voce", at: person.at + 0.002, node: <span className="spectrum-pulse rounded-md bg-purple px-2 py-0.5 text-[11px] font-bold text-white">{youLabel}</span> },
        ].sort((x, y) => x.at - y.at);
        const ROW = 44;
        const H = items.length * ROW;
        const BAR_X = 112;
        const yOf = (at: number) => (pct(at) / 100) * H;
        return (
          <div className="relative mt-4 lg:hidden print:hidden" style={{ height: H }}>
            {/* nomes das faixas, à esquerda */}
            {SPECTRUM_BANDS.map((b, i) => (
              <span key={b.label} className="absolute right-[calc(100%-104px)] -translate-y-1/2 text-right text-[11px] font-semibold leading-tight text-ink-2" style={{ top: yOf(i + 0.5) }}>{b.label}</span>
            ))}
            {/* a régua */}
            <div className={`${anim("spectrum-grow")} absolute top-0 flex w-3 flex-col overflow-hidden rounded-full`} style={{ left: BAR_X, height: H, transformOrigin: "top" }}>
              {SPECTRUM_BANDS.map((b, i) => <span key={b.label} style={{ background: b.color, flexGrow: WIDTHS[i], flexBasis: 0 }} />)}
            </div>
            {/* setas pontilhadas: de cada item até o ponto exato da régua */}
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              {items.map((it, i) => (
                <line key={it.key} x1={BAR_X + 34} y1={(i + 0.5) * ROW} x2={BAR_X + 20} y2={yOf(it.at)} className="stroke-ink-3" strokeWidth={1.5} strokeDasharray="3 3" strokeLinecap="round" />
              ))}
            </svg>
            {items.map((it) => (
              <span key={`p-${it.key}`} aria-hidden="true" className="absolute h-0 w-0 -translate-y-1/2 border-y-[4px] border-r-[6px] border-y-transparent border-r-ink-3" style={{ left: BAR_X + 14, top: yOf(it.at) }} />
            ))}
            {items.map((it, i) => (
              <div key={`c-${it.key}`} className={`${anim("spectrum-pop")} absolute -translate-y-1/2`} style={{ left: BAR_X + 38, top: (i + 0.5) * ROW, ...delay(0.2 + i * 0.05) }}>{it.node}</div>
            ))}
          </div>
        );
      })()}

      <ul className="mt-3 space-y-0.5 text-[11px] text-ink-2">
        {candidates.map((t) => <li key={t.c.id}><span className="font-semibold text-ink">{t.c.name}:</span> {t.spot.label}</li>)}
      </ul>
      <p style={delay(1.8)} className={`${anim("spectrum-pop")} mt-3 rounded-lg border border-purple/30 bg-purple-soft px-3 py-2 text-sm text-ink`}>
        {closest ? <>Sua ideologia está mais próxima de: <span className="font-bold text-purple-strong">{closest.c.name}</span></> : <>Sua ideologia ficou equivalente entre os dois candidatos.</>}
      </p>

      <dialog ref={dialogRef} className="modal" aria-labelledby="espectro-detalhe" onClose={() => { setOpenId(null); setOpenTerm(null); }} onClick={(e) => { if (e.target === dialogRef.current) setOpenId(null); }}>
        {openId ? (
          <div className="modal-panel">
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
              <h4 id="espectro-detalhe" className="min-w-0 flex-1 text-base font-bold">{section ? (openTerm && SPECTRUM_HISTORY[openTerm] ? `${section.title.split(":")[0]}: ${openTerm}` : section.title) : "Espectro político"}</h4>
              <button type="button" onClick={() => setOpenId(null)} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper"><span aria-hidden="true" className="text-xl leading-none">×</span></button>
            </header>
            <div className="modal-body space-y-6 px-5 py-4">
              {section ? (
                <>
                  {(() => { const h = (openTerm ? SPECTRUM_HISTORY[openTerm] : undefined) ?? SPECTRUM_HISTORY[section.id]; return h ? <HistoryBook h={h} /> : null; })()}
                  <SpectrumBlocks blocks={section.blocks} />
                  <button type="button" onClick={() => { setOpenTerm(null); setOpenId("intro"); }} className="text-sm font-semibold text-purple underline underline-offset-4">Entenda o espectro político →</button>
                </>
              ) : (
                <>
                  <SpectrumBlocks blocks={SPECTRUM_INTRO} />
                  {[SPECTRUM_COMPARISON].map((s) => (
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
