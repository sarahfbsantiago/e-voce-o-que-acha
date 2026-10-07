"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { Candidate, CandidatePosition, CandidateProfile, Evidence, ProgramSummary, SourceRegistryEntry } from "@/domain/types";
import { PRIORITY_LEVELS } from "@/domain/types";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { CURRENT_METHODOLOGY_VERSION } from "@/data/methodology";
import { buildPriorityMap } from "@/domain/user-summary";
import { orderCandidates, randomCandidateOrder } from "@/domain/candidate-order";
import { FINAL_MESSAGE } from "@/domain/neutrality";
import { useSession } from "@/store/session";
import { StartButton } from "@/components/StartButton";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { RestartButton } from "@/components/RestartButton";
import { PrintButton } from "@/components/PrintButton";
import { FeedbackForm } from "./FeedbackForm";
import { TopicPie } from "./TopicPie";
import { ProfileProximity } from "./ProfileProximity";
import { AREA_GROUPS, groupOfTopic } from "./areaGroups";
import { CandidatesSection } from "./CandidatesSection";

interface Props {
  candidates: Candidate[];
  positions: CandidatePosition[];
  evidence: Evidence[];
  summaries: ProgramSummary[];
  sources: SourceRegistryEntry[];
  profiles: CandidateProfile[];
}

/**
 * Relatório final, enxuto: perfil por área (pizza), proximidade por tema, cobertura das respostas
 * trajetória de cada candidato e, ao final, as fontes. Comparações pergunta a pergunta ficam fora, por enquanto.
 */
export function ReportView({ candidates, positions, evidence, summaries, sources, profiles }: Props) {
  const { session, hydrated, update } = useSession();
  const sourceById = useMemo(() => Object.fromEntries(sources.map((s) => [s.id, s])), [sources]);
  const submitted = useRef(false);

  // Sorteia a ordem dos candidatos uma vez por sessão.
  useEffect(() => {
    if (hydrated && !session.candidateOrder) update({ candidateOrder: randomCandidateOrder(candidates.map((c) => c.id)) });
  }, [hydrated, session.candidateOrder, candidates, update]);

  // Envio anônimo, somente com consentimento, uma única vez.
  useEffect(() => {
    if (!hydrated || submitted.current) return;
    if (session.consent !== "accepted" || session.submittedAt || session.answers.length === 0) return;
    submitted.current = true;
    fetch("/api/survey/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        methodologyVersion: CURRENT_METHODOLOGY_VERSION,
        answers: session.answers,
        topicPriorities: session.priorities,
        optionalAgeRange: session.demographics.ageRange,
        optionalRegion: session.demographics.region,
      }),
    })
      .then((r) => (r.ok ? update({ submittedAt: new Date().toISOString() }) : undefined))
      .catch(() => undefined);
  }, [hydrated, session, update]);

  if (!hydrated) return <div className="container-page py-12 text-ink-3">Carregando…</div>;

  if (session.answers.length === 0) {
    return (
      <div className="container-page py-12 max-w-2xl">
        <h1 className="text-2xl font-bold">Ainda não há respostas neste navegador</h1>
        <p className="mt-2 text-ink-2">Responda ao questionário para ver o seu relatório.</p>
        <div className="mt-6"><StartButton /></div>
      </div>
    );
  }

  const ordered = orderCandidates(candidates, session.candidateOrder);
  const sections = buildPriorityMap(TOPICS, QUESTIONS, session.answers, session.priorities);

  return (
    <div className="container-page py-7 md:py-14 space-y-9 sm:space-y-12">
      {/* ---------------- Cabeçalho ---------------- */}
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="purple">Relatório</Eyebrow>
          <PrintButton />
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Seu perfil</h1>
        <p className="hidden print:block text-xs text-ink-3 mt-1">Gerado em {new Date().toLocaleDateString("pt-BR")} · Menos Pior · nada aqui é nota ou ranking</p>
        <p className="mt-3 text-ink-2">
          O que você disse que importa, tema a tema, e com quem suas respostas ficaram mais próximas nos temas em que há posições publicadas. Nada aqui vira nota ou ranking.
        </p>
        <p className="mt-2 text-sm text-ink-3">
          Ordem dos candidatos sorteada nesta sessão. Consentimento: {session.consent === "accepted" ? (session.submittedAt ? "respostas enviadas anonimamente" : "envio anônimo pendente") : "respostas apenas neste navegador"}.
        </p>
      </header>

      {/* ---------------- Perfil por área ---------------- */}
      <section aria-labelledby="perfil" className="space-y-4">
        <h2 id="perfil" className="text-xl font-bold border-l-4 border-accent pl-3">Seu perfil por área</h2>
        <TopicPie sections={sections} />
        <div className="card p-4 text-xs text-ink-2">
          <p className="font-semibold text-ink">As cinco áreas</p>
          <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
            {AREA_GROUPS.map((g) => (
              <li key={g.id} className="flex items-baseline gap-2">
                <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: g.color }} />
                <span className="font-medium text-ink">{g.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <ProfileProximity sections={sections} questions={QUESTIONS} answers={session.answers} candidates={ordered} positions={positions} evidence={evidence} sources={sources} />
      </section>

      {/* ---------------- Como você respondeu ---------------- */}
      <section aria-labelledby="respostas" className="space-y-4">
        <h2 id="respostas" className="text-xl font-bold border-l-4 border-mint pl-3">Como você respondeu</h2>
        <div className="card p-5 max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Respostas “não sei”</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{sections.reduce((n, s) => n + s.noOpinion, 0)}</p>
          <p className="text-xs text-ink-3">de {sections.reduce((n, s) => n + s.total, 0)} perguntas</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => (
            <li key={s.topic.id} className="card p-4">
              <span
                className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold shadow-sm"
                style={{ background: groupOfTopic(s.topic.id).color, color: groupOfTopic(s.topic.id).id === "seguranca" ? "#1f1a0a" : "#fff" }}
              >
                #{i + 1}
              </span>
              <h3 className="mt-2 font-semibold">{s.topic.name}</h3>
              <p className="text-sm font-semibold text-purple mt-1">{s.priorityLevel !== null ? PRIORITY_LEVELS[s.priorityLevel].label : "Importância não informada"}</p>
              <p className="text-xs text-ink-3 mt-2">{s.answered}/{s.total} respondidas · {s.noOpinion} “não sei”</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Trajetória dos candidatos ---------------- */}
      <CandidatesSection ordered={ordered} profiles={profiles} summaries={summaries} sourceById={sourceById} />

      {/* ---------------- Fontes ---------------- */}
      <section aria-labelledby="fontes" className="space-y-4">
        <h2 id="fontes" className="text-xl font-bold border-l-4 border-gold pl-3">Fontes</h2>
        <Link href="/fontes" className="card card-lift block max-w-md p-5 shadow-sm">
          <p className="font-semibold">Ver todas as fontes</p>
          <p className="mt-1 text-sm text-ink-2">Catálogo completo dos documentos oficiais usados no site, com link para cada um.</p>
          <p className="mt-2 text-sm font-medium text-accent">Abrir fontes →</p>
        </Link>
      </section>

      {/* ---------------- Avaliação e encerramento ---------------- */}
      <div className="print:hidden"><FeedbackForm /></div>

      <section className="print-keep text-center py-8 max-w-3xl mx-auto">
        <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight leading-snug">{FINAL_MESSAGE}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <ButtonLink href="/questionario/perguntas" variant="secondary">Revisar minhas respostas</ButtonLink>
          <RestartButton label="Refazer do zero" variant="secondary" />
          <PrintButton />
        </div>
      </section>
    </div>
  );
}
