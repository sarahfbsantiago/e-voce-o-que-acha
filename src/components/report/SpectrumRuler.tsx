"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SPECTRUM_HISTORY, type SectionHistory } from "@/data/spectrum-history";
import { SPECTRUM_BANDS, CANDIDATE_SPECTRUM, personSpectrum, bandAt } from "@/data/political-spectrum";
import { SPECTRUM_COMPARISON, SPECTRUM_INTRO, SPECTRUM_SECTIONS, SPECTRUM_TERMS, type SpectrumBlock } from "@/data/spectrum-terms";

const N = SPECTRUM_BANDS.length;
const pct = (at: number) => (at / N) * 100;
/** Rótulo centrado na seta, mas encostado na borda quando a seta está perto das pontas. */
/** No celular: o que fica "entre" duas faixas vai para a linha da divisa mais próxima; o resto, para o meio da faixa. */
const slotOf = (at: number, between = false) => {
  const r = Math.round(at);
  if (between && r > 0 && r < N) return r;
  return Math.min(N - 1, Math.max(0, Math.floor(at))) + 0.5;
};
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
      <div className="space-y-2 font-serif text-[15px] leading-relaxed text-ink">
        {h.story.map((p) => <p key={p}>{p}</p>)}
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
    <span key={label} className={`${anim("spectrum-pop")} inline-block`} style={delay(0.25 + at * 0.08)}>
      <button type="button" onClick={() => setOpenId(sectionId)} title={`Ler sobre ${label.toLowerCase()}`} className="spectrum-btn inline-flex items-center gap-1 rounded-xl px-1.5 py-1.5 lg:gap-1.5 lg:px-2.5 text-left text-[11px] font-semibold leading-tight text-purple-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple">
        <span aria-hidden="true" className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-purple text-[9px] lg:h-4 lg:w-4 lg:text-[10px] font-bold text-white shadow-sm">i</span>
        <span className="w-min min-w-0">{label}</span>
      </button>
    </span>
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
        {/* acima: botões espaçados, setas (retas ou inclinadas) até o ponto exato; candidatos logo acima da régua */}
        <div className="relative h-40">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 160" preserveAspectRatio="none">
            {SPECTRUM_TERMS.filter((t) => t.side === "above").map((t) => (
              <line key={t.label} x1={pct(t.chip)} y1={98} x2={pct(t.at)} y2={153} className={`${anim("spectrum-pop")} stroke-ink-3`} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={delay(0.4 + t.at * 0.08)} />
            ))}
          </svg>
          {SPECTRUM_TERMS.filter((t) => t.side === "above").map((t) => (
            <span key={t.label}>
              <div className="absolute bottom-[62px]" style={{ left: `${pct(t.chip)}%`, transform: "translateX(-50%)" }}>{termButton(t.label, t.section, t.at)}</div>
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
          {SPECTRUM_BANDS.map((b) => <span key={b.label} className="h-full flex-1" style={{ background: b.color }} />)}
        </div>

        {/* abaixo: nomes das faixas, você e os botões de baixo, com setas até o ponto exato */}
        <div className="relative h-44">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 176" preserveAspectRatio="none">
            {SPECTRUM_TERMS.filter((t) => t.side === "below").map((t, i) => (
              <line key={t.label} x1={pct(t.chip)} y1={i % 2 ? 128 : 96} x2={pct(t.at)} y2={8} className={`${anim("spectrum-pop")} stroke-ink-3`} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={delay(0.4 + t.at * 0.08)} />
            ))}
          </svg>
          {SPECTRUM_TERMS.filter((t) => t.side === "below").map((t, i) => (
            <span key={t.label}>
              <span aria-hidden="true" className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[4px] border-b-[7px] border-x-transparent border-b-ink-3" style={{ left: `${pct(t.at)}%` }} />
              <div className={`absolute ${i % 2 ? "top-[128px]" : "top-[96px]"}`} style={{ left: `${pct(t.chip)}%`, transform: "translateX(-50%)" }}>{termButton(t.label, t.section, t.at)}</div>
            </span>
          ))}
          <div className="relative mt-1.5 grid grid-cols-8 gap-0.5">
            {SPECTRUM_BANDS.map((b) => <span key={b.label} className="text-center text-[11px] leading-tight text-ink-3"><span className="rounded bg-surface/85 px-0.5">{b.label}</span></span>)}
          </div>
          <div className="absolute inset-x-0 top-9 z-10 h-12">
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

      {/* celular: régua em pé */}
      <ol className="mt-4 md:hidden">
        {slots.map(({ at, band }) => {
          const terms = SPECTRUM_TERMS.filter((t) => slotOf(t.at, t.between) === at);
          const cands = candidates.filter((t) => slotOf(t.spot.at, t.spot.label.startsWith("Progressista")) === at);
          const you = slotOf(person.at, person.ideology === "Progressismo") === at;
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
                  {SPECTRUM_HISTORY[section.id] ? <HistoryBook h={SPECTRUM_HISTORY[section.id]} /> : null}
                  <SpectrumBlocks blocks={section.blocks} />
                  <button type="button" onClick={() => setOpenId("intro")} className="text-sm font-semibold text-purple underline underline-offset-4">Entenda o espectro político →</button>
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
