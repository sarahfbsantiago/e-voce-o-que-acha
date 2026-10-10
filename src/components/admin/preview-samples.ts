import type { SessionState } from "@/store/session";
import type { UserAnswer } from "@/domain/types";
import { activeQuestions, type LiveConfig } from "@/lib/live-config";

const session = (answers: UserAnswer[]): SessionState => ({ version: 1, consent: "declined", consentUpdatedAt: null, answers, priorities: [], candidateOrder: ["lula", "flavio-bolsonaro"], demographics: { ageRange: null, region: null }, completedAt: new Date().toISOString(), submittedAt: null });

/** Questionários de exemplo: três perfis montados (esquerda, centro, direita) e os últimos reais. */
export function previewSamples(cfg: LiveConfig, real: { answers: UserAnswer[] }[]) {
  const qs = activeQuestions(cfg);
  const pickBy = (fn: (opts: { id: string }[]) => { id: string }) => qs.map((q) => ({ questionId: q.id, optionIds: [fn(q.options.filter((o) => !o.isNoOpinion)).id] }));
  return [
    { label: "Exemplo: respostas mais à esquerda", session: session(pickBy((o) => o[0])) },
    { label: "Exemplo: respostas ao centro", session: session(pickBy((o) => o[Math.floor((o.length - 1) / 2)])) },
    { label: "Exemplo: respostas mais à direita", session: session(pickBy((o) => o[o.length - 1])) },
    ...real.slice(-3).reverse().map((r, i) => ({ label: `Questionário real recente ${i + 1}`, session: session(r.answers) })),
  ];
}

