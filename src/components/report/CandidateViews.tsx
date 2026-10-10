"use client";

import Link from "next/link";
import type { Candidate } from "@/domain/types";
import { CANDIDATE_VIEWS, type ViewBlock } from "@/data/candidate-views";
import { Modal } from "@/components/Modal";

/**
 * Dois quadrados fixos abaixo da barra de porcentagem: "Visão Flávio" e "Visão Lula".
 * Ao clicar, abre uma janela com rolagem e o texto revisado pela responsável; no final, "Veja as fontes".
 * A ordem segue a ordem sorteada dos candidatos nesta sessão.
 */
export function CandidateViews({ candidates }: { candidates: Candidate[] }) {
  const views = candidates
    .map((c, i) => ({ c, i, view: CANDIDATE_VIEWS.find((v) => v.candidateId === c.id) }))
    .filter((x): x is { c: Candidate; i: number; view: NonNullable<typeof x.view> } => Boolean(x.view));
  if (!views.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {views.map(({ c, i, view }) => (
        <Modal
          key={c.id}
          plainTrigger
          title={view.label}
          className={`card card-lift flex min-h-28 w-full flex-col justify-between gap-3 p-5 text-left shadow-sm border-t-4 ${i === 0 ? "border-t-accent" : "border-t-mint"}`}
          trigger={
            <>
              <span className="text-lg font-bold">{view.label}</span>
              <span className="text-sm font-medium text-purple">
                {view.sections.length ? "Clique para ler" : "Texto em revisão"} <span aria-hidden="true">→</span>
              </span>
            </>
          }
        >
          <div className="space-y-4">
            {view.sections.length ? (
              view.sections.map((s) => (
                <section key={s.title} className="space-y-1.5">
                  <h4 className="font-semibold">{s.title}</h4>
                  <ViewBlocks blocks={s.blocks} />
                </section>
              ))
            ) : (
              <p className="text-sm text-ink-2">Texto em revisão. Em breve.</p>
            )}
            <div className="border-t border-line pt-4">
              <Link href="/fontes" className="inline-flex items-center gap-1 text-sm font-semibold text-purple underline underline-offset-4 hover:text-purple-strong">
                Veja as fontes →
              </Link>
            </div>
          </div>
        </Modal>
      ))}
    </div>
  );
}

/** Texto de uma visão: parágrafos, listas e itens com título em negrito. */
export function ViewBlocks({ blocks }: { blocks: ViewBlock[] }) {
  return (
    <>
      {blocks.map((b, k) =>
        typeof b === "string" ? (
          <p key={k} className="text-sm leading-relaxed text-ink-2">{b}</p>
        ) : "list" in b ? (
          <ul key={k} className="list-disc pl-5 text-sm leading-relaxed text-ink-2">
            {b.list.map((li) => <li key={li}>{li}</li>)}
          </ul>
        ) : (
          <div key={k} className="rounded-lg border border-line bg-paper/60 p-2.5">
            <p className="text-sm font-semibold text-ink">{b.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{b.text}</p>
          </div>
        ),
      )}
    </>
  );
}
