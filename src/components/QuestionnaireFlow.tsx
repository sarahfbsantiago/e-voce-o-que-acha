"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { RestartButton } from "@/components/RestartButton";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { PRIORITY_LEVELS, type PriorityLevel, type Question, type Topic } from "@/domain/types";
import { setAnswer, setPriority, useSession } from "@/store/session";
import { AREA_GROUPS } from "@/components/report/areaGroups";

/**
 * Fluxo do questionário, direto ao ponto: pergunta 1 → responde → Avançar → pergunta 2 → …
 * Nunca avança sozinho: a pessoa sempre confirma no botão.
 * Cinco seções, uma por área do relatório, com a cor da área no gráfico. Cada seção começa
 * perguntando a importância da área (vale para todos os temas dela e só ordena o relatório)
 * e segue com as perguntas dos temas da área.
 * Notas de contexto, argumentos e fontes ficam para o relatório final.
 * Sem nomes de candidatos, sem cores partidárias.
 */
type Area = (typeof AREA_GROUPS)[number];
type Step =
  | { kind: "priority"; area: Area; section: number; topics: Topic[] }
  | { kind: "question"; area: Area; section: number; topic: Topic; question: Question; number: number };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  let n = 0;
  AREA_GROUPS.forEach((area, i) => {
    const topics = TOPICS.filter((t) => area.topicIds.includes(t.id)).sort((a, b) => a.order - b.order);
    steps.push({ kind: "priority", area, section: i + 1, topics });
    for (const topic of topics) {
      for (const q of QUESTIONS.filter((q) => q.topicId === topic.id).sort((a, b) => a.order - b.order)) {
        n += 1;
        steps.push({ kind: "question", area, section: i + 1, topic, question: q, number: n });
      }
    }
  });
  return steps;
}

/** Primeiro passo pendente: importância da área não declarada ou pergunta não respondida. */
function resumeIndex(steps: Step[], answers: { questionId: string }[], priorities: { topicId: string }[]): number {
  const answered = new Set(answers.map((a) => a.questionId));
  const prioritized = new Set(priorities.map((p) => p.topicId));
  const first = steps.findIndex((s) => (s.kind === "question" && !answered.has(s.question.id)) || (s.kind === "priority" && s.topics.some((t) => !prioritized.has(t.id))));
  return first === -1 ? steps.length - 1 : first;
}

/** Fundo suave da cor da área (a cor do gráfico com transparência). */
const soft = (hex: string) => `${hex}22`;

/** Importância: da mais alta para a mais baixa. */
const PRIORITY_DESC = [...PRIORITY_LEVELS].reverse();

/**
 * Ordem de exibição: a alternativa mais afirmativa primeiro (Concordo / Sim / "deveria continuar"),
 * descendo até a mais negativa; "Não sei" sempre por último. Alternativas sem escala mantêm a ordem original.
 * Só muda a exibição: ids, valores e comparações não são afetados.
 */
function displayOptions(question: Question) {
  const scaled = question.options.filter((o) => !o.isNoOpinion);
  const noOpinion = question.options.filter((o) => o.isNoOpinion);
  const hasScale = scaled.length > 0 && scaled.every((o) => o.normalizedValue !== null);
  const ordered = hasScale ? [...scaled].sort((a, b) => (b.normalizedValue ?? 0) - (a.normalizedValue ?? 0) || a.order - b.order) : scaled;
  return [...ordered, ...noOpinion];
}

export function QuestionnaireFlow() {
  const router = useRouter();
  const { session, hydrated, update } = useSession();
  const steps = useMemo(() => buildSteps(), []);
  // null = ainda não navegou nesta visita; usa o passo retomado.
  const [navigatedIndex, setNavigatedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hydrated && session.consent !== "accepted") router.replace("/questionario");
  }, [hydrated, session.consent, router]);

  if (!hydrated) return <div className="container-page py-12 text-ink-3">Carregando…</div>;

  const index = navigatedIndex ?? resumeIndex(steps, session.answers, session.priorities);
  const step = steps[index];
  const totalQuestions = steps.filter((s) => s.kind === "question").length;
  const answeredCount = session.answers.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const isLast = index === steps.length - 1;

  function go(to: number) {
    setNavigatedIndex(Math.max(0, Math.min(to, steps.length - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function next() {
    if (isLast) {
      update({ completedAt: new Date().toISOString() });
      router.push("/relatorio");
      return;
    }
    go(index + 1);
  }
  const canAdvance =
    (step.kind === "question" && session.answers.some((a) => a.questionId === step.question.id)) ||
    (step.kind === "priority" && step.topics.every((t) => session.priorities.some((p) => p.topicId === t.id)));
  const color = step.area.color;
  const areaLevel = (() => {
    if (step.kind !== "priority") return null;
    const levels = step.topics.map((t) => session.priorities.find((p) => p.topicId === t.id)?.level);
    return levels.every((l) => l !== undefined && l === levels[0]) ? levels[0] : null;
  })();

  return (
    <div className="container-page py-8 md:py-12 max-w-2xl">
      <div className="mb-6">
        {/* as cinco seções, cada uma com a cor da área no gráfico; a atual em destaque */}
        <ol className="mb-4 grid grid-cols-5 gap-1.5" aria-label="Seções do questionário">
          {AREA_GROUPS.map((g, i) => (
            <li key={g.id} aria-current={i + 1 === step.section ? "step" : undefined} title={g.label}>
              <span className="block h-1.5 rounded-full" style={{ background: g.color, opacity: i + 1 === step.section ? 1 : i + 1 < step.section ? 0.55 : 0.2 }} />
            </li>
          ))}
        </ol>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink" style={{ background: soft(color), borderColor: color }}>
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
            <span className="truncate">Seção {step.section} de {AREA_GROUPS.length} · {step.area.label}</span>
          </span>
          <span aria-live="polite" className="shrink-0 text-ink-3">{answeredCount} de {totalQuestions}</span>
        </div>
        {step.kind === "question" ? <p className="mt-2 text-sm font-medium text-ink-2">Tema: {step.topic.name}</p> : null}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progresso do questionário">
          <div className="progress-shine h-full rounded-full bg-gradient-to-r from-accent via-purple to-mint transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={index} className="animate-fade-up">
        {step.kind === "question" ? (
          <QuestionCard
            question={step.question}
            number={step.number}
            total={totalQuestions}
            color={color}
            selected={session.answers.find((a) => a.questionId === step.question.id)?.optionIds ?? []}
            onChange={(ids) => update((prev) => setAnswer(prev, step.question.id, ids))}
          />
        ) : (
          <section className="card border-t-4 p-6 md:p-8 shadow-sm" style={{ borderTopColor: color }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: step.area.id === "seguranca" ? "#8f6c0e" : color }}>Início da seção {step.section} de {AREA_GROUPS.length}</p>
            <h1 className="mt-2 text-xl md:text-2xl font-bold leading-snug">{step.area.label}</h1>
            <p className="mt-2 text-sm text-ink-2">Nesta seção, perguntas sobre:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {step.topics.map((t) => (
                <li key={t.id} className="rounded-full border px-3 py-1 text-xs font-medium" style={{ background: soft(color), borderColor: color }}>{t.name}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold leading-snug">Quanto esses temas importam para você?</h2>
            <p className="mt-1 text-sm text-ink-3">Serve apenas para ordenar o seu relatório.</p>
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Importância da seção {step.area.label}</legend>
              {PRIORITY_DESC.map((l) => {
                const checked = areaLevel === l.value;
                return (
                  <label key={l.value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${checked ? "" : "border-line hover:border-line-strong hover:bg-paper"}`} style={checked ? { borderColor: color, background: soft(color) } : undefined}>
                    <input
                      type="radio"
                      name={`prio-${step.area.id}`}
                      className="h-[1.125rem] w-[1.125rem] shrink-0"
                      style={{ accentColor: color }}
                      checked={checked}
                      onChange={() => update((prev) => ({ priorities: step.topics.reduce((acc, t) => setPriority({ ...prev, priorities: acc }, t.id, l.value as PriorityLevel).priorities ?? acc, prev.priorities) }))}
                    />
                    <span>{l.label}</span>
                  </label>
                );
              })}
            </fieldset>
          </section>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>Voltar</Button>
        <span className="text-xs text-ink-3">{step.kind === "question" ? `Pergunta ${step.number} de ${totalQuestions}` : `Seção ${step.section} de ${AREA_GROUPS.length}`}</span>
        <Button onClick={next} disabled={!canAdvance}>{isLast ? "Ver meu relatório" : "Avançar"}</Button>
      </div>
      <div className="mt-8 flex justify-center">
        <RestartButton />
      </div>
    </div>
  );
}

function QuestionCard({ question, number, total, selected, onChange, color }: { question: Question; number: number; total: number; selected: string[]; onChange: (ids: string[]) => void; color: string }) {
  const multiple = question.kind === "MULTI_CHOICE";

  function toggle(optionId: string, isNoOpinion: boolean) {
    if (!multiple) return onChange([optionId]);
    if (isNoOpinion) return onChange([optionId]);
    const withoutNoOpinion = selected.filter((id) => !question.options.find((o) => o.id === id)?.isNoOpinion);
    return onChange(withoutNoOpinion.includes(optionId) ? withoutNoOpinion.filter((id) => id !== optionId) : [...withoutNoOpinion, optionId]);
  }

  return (
    <section className="card border-t-4 p-5 sm:p-6 md:p-8 shadow-sm" style={{ borderTopColor: color }}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-2">
        Pergunta {number} de {total}{question.subtopic ? ` · ${question.subtopic}` : ""}
      </p>
      <fieldset>
        <legend className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold leading-snug">{question.text}</legend>
        <p className="mt-1 text-sm text-ink-3">{multiple ? "Marque uma ou mais alternativas e clique em Avançar." : "Marque uma alternativa e clique em Avançar."}</p>
        <div className="mt-5 space-y-2">
          {displayOptions(question).map((o) => {
            const checked = selected.includes(o.id);
            return (
              <label key={o.id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${checked ? "" : "border-line hover:border-line-strong hover:bg-paper"}`} style={checked ? { borderColor: color, background: soft(color) } : undefined}>
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={question.id}
                  value={o.id}
                  checked={checked}
                  onChange={() => toggle(o.id, o.isNoOpinion)}
                  className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0"
                  style={{ accentColor: color }}
                />
                <span className={o.isNoOpinion ? "text-ink-2" : ""}>{o.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
