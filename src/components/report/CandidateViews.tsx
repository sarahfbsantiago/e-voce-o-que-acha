"use client";

import Link from "next/link";
import { useState } from "react";
import type { Candidate } from "@/domain/types";
import { CANDIDATE_VIEWS } from "@/data/candidate-views";

/**
 * Duas caixinhas abaixo da barra de porcentagem: "Visão Flávio" e "Visão Lula".
 * Ao clicar, abre o texto revisado pela responsável, com link para a página de fontes.
 * A ordem segue a ordem sorteada dos candidatos nesta sessão.
 */
export function CandidateViews({ candidates }: { candidates: Candidate[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const views = candidates
    .map((c, i) => ({ c, i, view: CANDIDATE_VIEWS.find((v) => v.candidateId === c.id) }))
    .filter((x) => x.view);
  if (!views.length) return null;
  const current = views.find((x) => x.c.id === open);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {views.map(({ c, i, view }) => {
          const active = open === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-expanded={active}
              aria-controls="visao-candidato"
              onClick={() => setOpen(active ? null : c.id)}
              className={`card card-lift flex items-center justify-between gap-3 p-4 text-left shadow-sm border-t-4 ${i === 0 ? "border-t-accent" : "border-t-mint"} ${active ? "ring-2 ring-purple/40" : ""}`}
            >
              <span className="font-semibold">{view!.label}</span>
              <span aria-hidden="true" className={`text-ink-3 transition-transform ${active ? "rotate-180" : ""}`}>▾</span>
            </button>
          );
        })}
      </div>

      {current ? (
        <div id="visao-candidato" className="card p-5 md:p-6 space-y-4 animate-fade-up">
          <h3 className="text-lg font-bold">{current.view!.label}</h3>
          {current.view!.sections.length ? (
            current.view!.sections.map((s) => (
              <section key={s.title} className="space-y-1.5">
                <h4 className="font-semibold">{s.title}</h4>
                {s.blocks.map((b, k) =>
                  typeof b === "string" ? (
                    <p key={k} className="text-sm leading-relaxed text-ink-2">{b}</p>
                  ) : (
                    <ul key={k} className="list-disc pl-5 text-sm leading-relaxed text-ink-2">
                      {b.list.map((li) => <li key={li}>{li}</li>)}
                    </ul>
                  ),
                )}
              </section>
            ))
          ) : (
            <p className="text-sm text-ink-2">Texto em revisão. Em breve.</p>
          )}
          <Link href="/fontes" className="inline-flex items-center gap-1 text-sm font-semibold text-purple underline underline-offset-4 hover:text-purple-strong">
            Veja as fontes →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
