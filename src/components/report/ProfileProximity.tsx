"use client";

import { useEffect, useRef, useState } from "react";
import type { Candidate, CandidatePosition, Question, UserAnswer } from "@/domain/types";
import type { TopicSection } from "@/domain/user-summary";
import { themeProximity } from "@/domain/theme-proximity";
import { compareAnswerToPosition } from "@/domain/comparison";
import { TOPIC_COLORS } from "./TopicPie";
import { AREA_GROUPS } from "./areaGroups";
import Link from "next/link";
import { CANDIDATE_VIEWS } from "@/data/candidate-views";
import { ViewBlocks } from "./CandidateViews";
import { SpectrumRuler } from "./SpectrumRuler";

/**
 * Qual candidato está mais próximo do seu perfil, tema a tema, só com posições publicadas.
 * Cada área abre uma janela com o texto revisado pela responsável sobre o que cada candidato defende
 * em cada tema e, no final, "Veja as fontes". Abaixo, a régua do espectro político.
 */
export function ProfileProximity({ sections, questions, answers, candidates, positions }: {
  sections: TopicSection[];
  questions: Question[];
  answers: UserAnswer[];
  candidates: Candidate[];
  positions: CandidatePosition[];
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
  const name = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;
  const first = (id: string) => name(id).split(" ")[0];

  const rows = ordered.map((s, i) => {
    const qs = questions.filter((q) => q.topicId === s.topic.id);
    const p = themeProximity(qs, answers, candidates, positions);
    return { s, color: TOPIC_COLORS[i % TOPIC_COLORS.length], closest: p.closestCandidateId, reason: p.reason };
  });

  // Totais por candidato em todas as perguntas comparáveis
  const totals = candidates.map((c) => {
    let comparable = 0, similar = 0, partial = 0, different = 0, silent = 0;
    for (const q of questions) {
      const pos = positions.find((x) => x.candidateId === c.id && x.questionId === q.id) ?? null;
      const r = compareAnswerToPosition(q, answerByQ.get(q.id), pos, c.id);
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
      <p className="mt-0.5 text-xs text-ink-3">Cinco áreas, com os temas dentro; a conta é feita tema a tema, só com posições publicadas. Toque numa área para ler o que cada candidato defende em cada tema.</p>

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
      <ul className="print-flow mt-5 grid gap-3 md:grid-cols-2 print:grid-cols-2">
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
                    <h5 className="text-base font-bold">{current.s.topic.name}</h5>
                    {current.closest ? <span className="rounded-md border border-accent/30 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-strong">mais próximo: {name(current.closest)}</span> : current.reason ? <span className="text-xs text-ink-3">{REASON[current.reason]}</span> : null}
                  </div>
                  {candidates.map((c) => {
                    const parts = CANDIDATE_VIEWS.find((v) => v.candidateId === c.id)?.sections.filter((x) => x.topicId === current.s.topic.id) ?? [];
                    return (
                      <div key={c.id} className="rounded-lg border border-line bg-paper/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.name}</p>
                        {parts.length ? (
                          <div className="mt-1.5 space-y-2">
                            {parts.map((part) => (
                              <div key={part.title} className="space-y-1">
                                {parts.length > 1 ? <p className="text-sm font-semibold">{part.title.replace(/^\d+\.\s*/, "")}</p> : null}
                                <ViewBlocks blocks={part.blocks} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1.5 text-sm text-ink-3">Texto em revisão. Em breve.</p>
                        )}
                      </div>
                    );
                  })}
                </section>
              ))}
              <div className="border-t border-line pt-4">
                <Link href="/fontes" className="inline-flex items-center gap-1 text-sm font-semibold text-purple underline underline-offset-4 hover:text-purple-strong">Veja as fontes →</Link>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>

      {/* régua do espectro político (no lugar da barra de porcentagem) */}
      {decided > 0 ? <SpectrumRuler totals={totals} answers={answers} /> : null}
    </section>
  );
}
