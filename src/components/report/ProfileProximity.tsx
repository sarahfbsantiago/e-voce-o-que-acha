"use client";

import { useEffect, useRef, useState } from "react";
import type { Candidate, CandidatePosition, Evidence, Question, SourceRegistryEntry, UserAnswer } from "@/domain/types";
import type { TopicSection } from "@/domain/user-summary";
import { themeProximity } from "@/domain/theme-proximity";
import { compareAnswerToPosition } from "@/domain/comparison";
import { TOPIC_COLORS } from "./TopicPie";
import { AREA_GROUPS } from "./areaGroups";
import { sourceHref } from "@/components/SourceBits";

const DIRECTION_TEXT: Record<string, string> = {
  SUPPORTS: "é a favor",
  PARTIALLY_SUPPORTS: "é a favor em parte",
  NEUTRAL: "quer manter como está",
  PARTIALLY_OPPOSES: "é contra em parte",
  OPPOSES: "é contra",
  UNCLEAR: "não se posicionou nas fontes oficiais",
};
/** Evidência mais relevante para explicar a posição: o que foi feito (lei, decreto, projeto) antes do que foi prometido; entre iguais, a mais recente. */
function mainEvidence(ev: Evidence[]): Evidence | undefined {
  const rank = (e: Evidence) => (e.classification === "ATUACAO" ? 0 : e.classification === "POSICAO" ? 1 : 2);
  return [...ev].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    const da = (a.eventDate ?? a.publicationDate ?? "") as string;
    const db = (b.eventDate ?? b.publicationDate ?? "") as string;
    return da < db ? 1 : da > db ? -1 : 0;
  })[0];
}
function fmt(d: string | null | undefined): string {
  if (!d) return "";
  const [y, m, day] = String(d).slice(0, 10).split("-");
  return y && m && day ? ` (${day}/${m}/${y})` : "";
}
const RESULT_TEXT: Record<string, string> = { SIMILAR: "igual a você", PARTIALLY_SIMILAR: "parecido com você", DIFFERENT: "diferente de você" };
const RESULT_TONE: Record<string, string> = { SIMILAR: "bg-mint-soft text-mint-strong", PARTIALLY_SIMILAR: "bg-gold-soft text-gold-strong", DIFFERENT: "bg-paper text-ink-2" };

/**
 * Qual candidato está mais próximo do seu perfil, tema a tema, só com posições publicadas.
 * Cada cartão vira ao clicar e explica, em linguagem simples, o que cada candidato pensa e por causa de qual
 * proposta ou projeto. No fim, a conta aberta: perguntas comparáveis, concordâncias e porcentagens.
 */
export function ProfileProximity({ sections, questions, answers, candidates, positions, evidence, sources = [] }: {
  sections: TopicSection[];
  questions: Question[];
  answers: UserAnswer[];
  candidates: Candidate[];
  positions: CandidatePosition[];
  evidence: Evidence[];
  sources?: SourceRegistryEntry[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (openId && !el.open) el.showModal();
    if (!openId && el.open) el.close();
  }, [openId]);
  const ordered = [...sections].sort((a, b) => a.topic.order - b.topic.order);
  const answerByQ = new Map(answers.map((a) => [a.questionId, a]));
  const evidenceById = new Map(evidence.map((e) => [e.id, e]));
  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const linkOf = (e: Evidence) => { const s = sourceById.get(e.sourceId); return s ? sourceHref(s) : null; };
  const name = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;
  const first = (id: string) => name(id).split(" ")[0];

  const rows = ordered.map((s, i) => {
    const qs = questions.filter((q) => q.topicId === s.topic.id);
    const p = themeProximity(qs, answers, candidates, positions);
    const detail = candidates.map((c) => ({
      c,
      items: qs.map((q) => {
        const pos = positions.find((x) => x.candidateId === c.id && x.questionId === q.id) ?? null;
        const result = compareAnswerToPosition(q, answerByQ.get(q.id), pos);
        const ev = (pos?.evidenceIds.map((id) => evidenceById.get(id)).filter(Boolean) ?? []) as Evidence[];
        const scaled = q.options.filter((o) => !o.isNoOpinion).every((o) => o.normalizedValue !== null);
        const closestLabel = pos?.closestOptionId ? q.options.find((o) => o.id === pos.closestOptionId)?.label ?? null : null;
        return { q, pos, result, ev, scaled, closestLabel };
      }),
    }));
    return { s, color: TOPIC_COLORS[i % TOPIC_COLORS.length], closest: p.closestCandidateId, reason: p.reason, counts: p.counts, detail };
  });

  // Totais por candidato em todas as perguntas comparáveis
  const totals = candidates.map((c) => {
    let comparable = 0, similar = 0, partial = 0, different = 0, silent = 0;
    for (const q of questions) {
      const pos = positions.find((x) => x.candidateId === c.id && x.questionId === q.id) ?? null;
      const r = compareAnswerToPosition(q, answerByQ.get(q.id), pos);
      if (!r) continue;
      if (r === "INSUFFICIENT_EVIDENCE") { silent++; continue; }
      comparable++;
      if (r === "SIMILAR") similar++; else if (r === "PARTIALLY_SIMILAR") partial++; else different++;
    }
    const themes = rows.filter((r) => r.closest === c.id).length;
    const answered = comparable + silent;
    const agreement = answered ? ((similar + partial / 2) / answered) * 100 : null;
    return { c, comparable, similar, partial, different, silent, answered, themes, agreement };
  });
  const decided = rows.filter((r) => r.closest).length;
  const REASON: Record<string, string> = {
    INSUFFICIENT_EVIDENCE: "nenhum dos candidatos tem posição documentada nas perguntas que você respondeu",
    TIE: "proximidade documentada equivalente entre os dois",
  };
  const areas = AREA_GROUPS.map((g) => ({ g, rows: rows.filter((r) => g.topicIds.includes(r.s.topic.id)) })).filter((a) => a.rows.length);
  const currentArea = areas.find((a) => a.g.id === openId) ?? null;

  return (
    <section className="card print-splittable p-5 md:p-6" aria-labelledby="proximidade">
      <h3 id="proximidade" className="text-sm font-semibold">Qual candidato está mais próximo do seu perfil</h3>
      <p className="mt-0.5 text-xs text-ink-3">Cinco áreas, com os temas dentro; a conta é feita tema a tema, só com posições publicadas. Toque numa área para ver, pergunta por pergunta, o que cada candidato pensa e por quê.</p>

      {/* resumo em temas */}
      {decided > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {totals.map(({ c, themes }) => (
            <div key={c.id} className="rounded-xl border border-line bg-paper/60 p-4">
              <p className="text-xs uppercase tracking-wide text-ink-3">{c.name}</p>
              <p className="mt-1 text-3xl font-bold text-accent">{themes}<span className="ml-1 text-sm font-medium text-ink-2">de {decided} temas comparáveis</span></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink-2">Ainda não há posições publicadas suficientes para comparar seu perfil com os candidatos.</p>
      )}

      {/* cinco cartões, um por área; os temas ficam dentro; o detalhe abre numa caixa com rolagem */}
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {areas.map(({ g, rows: rs }) => (
          <li key={g.id}>
            <button type="button" onClick={() => setOpenId(g.id)} className="card-lift w-full rounded-xl border border-line bg-paper/50 p-3 text-left transition-colors hover:border-accent/40">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-sm" style={{ background: g.color }} />
                <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{g.label}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {rs.map((r) => (
                  <li key={r.s.topic.id} className="flex items-center gap-2 text-xs">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-sm" style={{ background: r.color }} />
                    <span className="min-w-0 flex-1 text-ink-2 leading-snug">{r.s.topic.name}</span>
                    {r.closest ? (
                      <span className="shrink-0 rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent-strong">{first(r.closest)}</span>
                    ) : (
                      <span className="shrink-0 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[11px] text-ink-3">{r.reason === "TIE" ? "equivalente" : "sem comparação"}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] font-medium text-accent print:hidden">Entender por quê →</p>
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className="modal" aria-labelledby="tema-detalhe" onClose={() => setOpenId(null)} onClick={(e) => { if (e.target === dialogRef.current) setOpenId(null); }}>
        {currentArea ? (
          <div className="modal-panel">
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-sm" style={{ background: currentArea.g.color }} />
              <h4 id="tema-detalhe" className="min-w-0 flex-1 truncate text-base font-bold">{currentArea.g.label}</h4>
              <button type="button" onClick={() => setOpenId(null)} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper"><span aria-hidden="true" className="text-xl leading-none">×</span></button>
            </header>
            <div className="modal-body space-y-6 px-5 py-4">
              {currentArea.rows.map((current) => (
                <section key={current.s.topic.id} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-sm" style={{ background: current.color }} />
                    <h5 className="text-sm font-bold">{current.s.topic.name}</h5>
                    {current.closest ? <span className="rounded-md border border-accent/30 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-strong">mais próximo: {name(current.closest)}</span> : current.reason ? <span className="text-xs text-ink-3">{REASON[current.reason]}</span> : null}
                  </div>
                  <ul className="space-y-0.5 text-xs text-ink-2">
                    {current.counts.map((c) => (
                      <li key={c.candidateId} className={c.documented === 0 ? "text-ink-3" : ""}>
                        <span className="font-medium text-ink">{first(c.candidateId)}:</span>{" "}
                        {c.documented === 0 ? `sem posição documentada neste tema${c.silent ? ` (${c.silent} pergunta${c.silent === 1 ? "" : "s"} contada${c.silent === 1 ? "" : "s"} como diferente)` : ""}` : `${c.similar} igual, ${c.partiallySimilar} parecido, ${c.different} diferente em ${c.documented} pergunta${c.documented === 1 ? "" : "s"}${c.silent ? ` + ${c.silent} sem posição (conta como diferente)` : ""}`}
                      </li>
                    ))}
                  </ul>
                  {current.detail.map(({ c, items }) => (
                    <div key={c.id}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.name}</p>
                      <ul className="mt-1.5 space-y-2">
                        {items.map(({ q, pos, result, ev, scaled, closestLabel }) => {
                          const main = mainEvidence(ev);
                          return (
                          <li key={q.id} className="rounded-lg border border-line bg-paper/60 p-2.5 text-xs leading-snug">
                            <p className="text-ink-3">{q.text}</p>
                            {pos && pos.direction !== "UNCLEAR" ? (
                              <p className="mt-1">
                                <span className="font-medium text-ink">{scaled || !closestLabel ? `${first(c.id)} ${DIRECTION_TEXT[pos.direction]}` : `${first(c.id)} escolheria “${closestLabel}”`}</span>
                                {main ? <span className="text-ink-2"> por causa de {linkOf(main) ? <a href={linkOf(main) as string} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-purple-strong"><em>{main.title}</em></a> : <em>{main.title}</em>}{fmt((main.eventDate ?? main.publicationDate) as string | null)}{ev.length > 1 ? ` (+${ev.length - 1})` : ""}</span> : null}
                                {result && result !== "INSUFFICIENT_EVIDENCE" ? <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${RESULT_TONE[result]}`}>{RESULT_TEXT[result]}</span> : <span className="ml-1 text-[10px] text-ink-3">você não respondeu</span>}
                              </p>
                            ) : (
                              <p className="mt-1 text-ink-3">{first(c.id)} {DIRECTION_TEXT.UNCLEAR}{result === "INSUFFICIENT_EVIDENCE" ? <span className="ml-1 rounded bg-paper px-1.5 py-0.5 text-[10px] font-semibold text-ink-2">conta como diferente</span> : null}</p>
                            )}
                          </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
        ) : null}
      </dialog>

      {/* barra de porcentagem: divisão dos temas em que cada candidato ficou mais perto */}
      {decided > 0 ? (
        <div className="mt-6">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-line" role="img" aria-label={totals.map((t) => `${t.c.name}: ${t.themes} temas`).join("; ")}>
            {totals.map((t, i) => t.themes > 0 ? (
              <span key={t.c.id} className={`flex items-center justify-center text-[10px] font-semibold text-white ${i === 0 ? "bg-accent" : "bg-mint"}`} style={{ width: `${(t.themes / decided) * 100}%` }}>{Math.round((t.themes / decided) * 100)}%</span>
            ) : null)}
          </div>
          <p className="mt-1 flex flex-wrap gap-x-4 text-[11px] text-ink-2">
            {totals.map((t, i) => <span key={t.c.id} className="flex items-center gap-1"><span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-sm ${i === 0 ? "bg-accent" : "bg-mint"}`} />{t.c.name}</span>)}
          </p>
        </div>
      ) : null}
    </section>
  );
}
