"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AgeRange, Region, TopicPriority, UserAnswer } from "@/domain/types";

/**
 * Estado da sessão do usuário. Fica EXCLUSIVAMENTE no navegador (localStorage).
 * Nada é enviado ao servidor sem consentimento explícito, e mesmo com
 * consentimento só os campos montados em ReportView são transmitidos.
 */
export interface SessionState {
  version: 1;
  consent: "accepted" | "declined" | null;
  consentUpdatedAt: string | null;
  answers: UserAnswer[];
  priorities: TopicPriority[];
  candidateOrder: string[] | null;
  demographics: { ageRange: AgeRange | null; region: Region | null };
  completedAt: string | null;
  submittedAt: string | null;
}

export const SESSION_KEY = "voce-decide:session:v1";

export const EMPTY_SESSION: SessionState = {
  version: 1,
  consent: null,
  consentUpdatedAt: null,
  answers: [],
  priorities: [],
  candidateOrder: null,
  demographics: { ageRange: null, region: null },
  completedAt: null,
  submittedAt: null,
};

// Cache para devolver a mesma referência enquanto o conteúdo não muda.
let cachedRaw: string | null | undefined;
let cachedState: SessionState = EMPTY_SESSION;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): SessionState {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  try {
    cachedState = raw ? { ...EMPTY_SESSION, ...(JSON.parse(raw) as Partial<SessionState>), version: 1 } : EMPTY_SESSION;
  } catch {
    cachedState = EMPTY_SESSION;
  }
  return cachedState;
}

function getServerSnapshot(): SessionState {
  return EMPTY_SESSION;
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function notify() {
  listeners.forEach((l) => l());
}

function write(state: SessionState) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // armazenamento indisponível: mantém em memória
    cachedRaw = undefined;
    cachedState = state;
  }
  notify();
}

const noopSubscribe = () => () => {};

export function useSession() {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const update = useCallback((patch: Partial<SessionState> | ((prev: SessionState) => Partial<SessionState>)) => {
    const prev = getSnapshot();
    write({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) });
  }, []);

  const reset = useCallback(() => write(EMPTY_SESSION), []);

  return { session, hydrated, update, reset };
}

/** Recomeça o questionário do zero: apaga respostas, prioridades e relatório; mantém consentimento e dados opcionais. */
export function restartAnswers(): Partial<SessionState> {
  return { answers: [], priorities: [], candidateOrder: null, completedAt: null, submittedAt: null };
}

export function setAnswer(prev: SessionState, questionId: string, optionIds: string[]): Partial<SessionState> {
  const others = prev.answers.filter((a) => a.questionId !== questionId);
  return { answers: optionIds.length ? [...others, { questionId, optionIds }] : others };
}

export function setPriority(prev: SessionState, topicId: string, level: TopicPriority["level"]): Partial<SessionState> {
  const others = prev.priorities.filter((p) => p.topicId !== topicId);
  return { priorities: [...others, { topicId, level }] };
}
