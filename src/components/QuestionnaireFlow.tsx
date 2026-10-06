"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { RestartButton } from "@/components/RestartButton";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { PRIORITY_LEVELS, type PriorityLevel, type Question, type Topic } from "@/domain/types";
import { setAnswer, setPriority, useSession } from "@/store/session";

/**
 * Fluxo do questionário, direto ao ponto: pergunta 1 → responde → Avançar → pergunta 2 → …
 * Nunca avança sozinho: a pessoa sempre confirma no botão.
 * Ao final de cada tema, uma pergunta curta de importância (serve só para ordenar o relatório).
 * Notas de contexto, argumentos e fontes ficam para o relatório final.
 * Sem nomes de candidatos, sem cores partidárias.
 */
type Step = { kind: "question"; topic: Topic; question: Question; number: number } | { kind: "priority"; topic: Topic };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  let n = 0;
  for (const topic of [...TOPICS].sort((a, b) => a.order - b.order)) {
    for (const q of QUESTIONS.filter((q) => q.topicId === topic.id).sort((a, b) => a.order - b.order)) {
      n += 1;
      steps.push({ kind: "question", topic, question: q, number: n });
    }
    steps.push({ kind: "priority", topic });
  }
  return steps;
}

/** Primeiro passo pendente: pergunta não respondida ou importância não declarada. */
function resumeIndex(steps: Step[], answers: { questionId: string }[], priorities: { topicId: string }[]): number {
  const answered = new Set(answers.map((a) => a.questionId));
  const prioritized = new Set(priorities.map((p) => p.topicId));
  const first = steps.findIndex((s) => (s.kind === "question" && !answered.has(s.question.id)) || (s.kind === "priority" && !prioritized.has(s.topic.id)));
  return first === -1 ? steps.length - 1 : first;
}

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
    if (hydrated && session.consent === null) router.replace("/questionario");
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
    (step.kind === "priority" && session.priorities.some((p) => p.topicId === step.topic.id));

  return (
    <div className="container-page py-8 md:py-12 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-2">
            {step.topic.name}
          </span>
          <span aria-live="polite" className="text-ink-3">{answeredCount} de {totalQuestions} respondidas</span>
        </div>
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
            selected={session.answers.find((a) => a.questionId === step.question.id)?.optionIds ?? []}
            onChange={(ids) => update((prev) => setAnswer(prev, step.question.id, ids))}
          />
        ) : (
          <section className="card p-6 md:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-strong">Importância do tema · {step.topic.name}</p>
            <h1 className="mt-2 text-xl font-bold leading-snug">{step.topic.priorityQuestion ?? "O quanto este tema é importante para você?"}</h1>
            <p className="mt-1 text-sm text-ink-3">Serve apenas para ordenar o seu relatório.</p>
            <fieldset className="mt-5 space-y-2">
              <legend className="sr-only">Importância</legend>
              {PRIORITY_DESC.map((l) => {
                const checked = session.priorities.find((p) => p.topicId === step.topic.id)?.level === l.value;
                return (
                  <label key={l.value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${checked ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong hover:bg-paper"}`}>
                    <input
                      type="radio"
                      name={`prio-${step.topic.id}`}
                      className="h-[1.125rem] w-[1.125rem] shrink-0 accent-accent"
                      checked={!!checked}
                      onChange={() => update((prev) => setPriority(prev, step.topic.id, l.value as PriorityLevel))}
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
        <span className="text-xs text-ink-3">{step.kind === "question" ? `Pergunta ${step.number} de ${totalQuestions}` : `Tema ${step.topic.order} de ${TOPICS.length}`}</span>
        <Button onClick={next} disabled={!canAdvance}>{isLast ? "Ver meu relatório" : "Avançar"}</Button>
      </div>
      <div className="mt-8 flex justify-center">
        <RestartButton />
      </div>
    </div>
  );
}

function QuestionCard({ question, number, total, selected, onChange }: { question: Question; number: number; total: number; selected: string[]; onChange: (ids: string[]) => void }) {
  const multiple = question.kind === "MULTI_CHOICE";

  function toggle(optionId: string, isNoOpinion: boolean) {
    if (!multiple) return onChange([optionId]);
    if (isNoOpinion) return onChange([optionId]);
    const withoutNoOpinion = selected.filter((id) => !question.options.find((o) => o.id === id)?.isNoOpinion);
    return onChange(withoutNoOpinion.includes(optionId) ? withoutNoOpinion.filter((id) => id !== optionId) : [...withoutNoOpinion, optionId]);
  }

  return (
    <section className="card p-5 sm:p-6 md:p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Pergunta {number} de {total}{question.subtopic ? ` · ${question.subtopic}` : ""}
      </p>
      <fieldset>
        <legend className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold leading-snug">{question.text}</legend>
        <p className="mt-1 text-sm text-ink-3">{multiple ? "Marque uma ou mais alternativas e clique em Avançar." : "Marque uma alternativa e clique em Avançar."}</p>
        <div className="mt-5 space-y-2">
          {displayOptions(question).map((o) => {
            const checked = selected.includes(o.id);
            return (
              <label key={o.id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${checked ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong hover:bg-paper"}`}>
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={question.id}
                  value={o.id}
                  checked={checked}
                  onChange={() => toggle(o.id, o.isNoOpinion)}
                  className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 accent-accent"
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
