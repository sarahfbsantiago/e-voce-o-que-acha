import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { CANDIDATES } from "@/data/candidates";
import { profileProximity } from "@/domain/profile-proximity";
import { buildResearchReport } from "@/lib/research-report";
import { ORDERED_QUESTIONS, QUESTION_NUMBER } from "@/lib/question-order";
import type { CandidatePosition, UserAnswer } from "@/domain/types";

const REMOVED = ["q07", "q24", "q39", "q41", "q48", "q49", "q02", "q04", "q06", "q34", "q35", "q37", "q10", "q12", "q14", "q15", "q16", "q18", "q19", "q22", "q26", "q29", "q40", "q42", "q44", "q46", "q47", "q50"];

/** Posição publicada fictícia: cada candidato escolhe a primeira alternativa de toda pergunta. */
const positions: CandidatePosition[] = CANDIDATES.flatMap((c) =>
  QUESTIONS.map((q) => ({
    id: `${c.id}-${q.id}`, candidateId: c.id, questionId: q.id, direction: "SUPPORTS", closestOptionId: q.options[0].id,
    summary: "", reviewStatus: "PUBLISHED", evidenceIds: [],
  }) as unknown as CandidatePosition),
);

describe("perguntas removidas", () => {
  it("não existem mais no questionário", () => {
    for (const id of REMOVED) expect(QUESTIONS.find((q) => q.id === id)).toBeUndefined();
    expect(QUESTIONS).toHaveLength(25);
  });

  it("numeração mostrada vai de 1 a 25, sem buracos", () => {
    expect(ORDERED_QUESTIONS.map((q) => QUESTION_NUMBER[q.id])).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it("respostas antigas a perguntas removidas não mudam a conta", () => {
    const current: UserAnswer[] = QUESTIONS.map((q) => ({ questionId: q.id, optionIds: [q.options[1].id] }));
    const withOld = [...current, ...REMOVED.map((id) => ({ questionId: id, optionIds: [`${id}-o1`] }))];
    expect(profileProximity(QUESTIONS, withOld, CANDIDATES, positions)).toEqual(profileProximity(QUESTIONS, current, CANDIDATES, positions));
  });

  it("questionário antigo não conta como completo só por ter respostas de perguntas removidas", () => {
    const partial = QUESTIONS.slice(0, 20).map((q) => ({ questionId: q.id, optionIds: [q.options[0].id] }));
    const old = { answers: [...partial, ...REMOVED.map((id) => ({ questionId: id, optionIds: [`${id}-o1`] }))], topicPriorities: [], submittedAt: "2026-10-07T12:00:00.000Z" };
    const full = { answers: QUESTIONS.map((q) => ({ questionId: q.id, optionIds: [q.options[0].id] })), topicPriorities: [], submittedAt: "2026-10-07T12:00:00.000Z" };
    const r = buildResearchReport([old, full] as never, []);
    expect(r.overview.completedAllQuestions).toBe(1);
  });
});
