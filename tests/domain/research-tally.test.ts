import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { CANDIDATES } from "@/data/candidates";
import { aggregateProfileProximity } from "@/domain/profile-proximity";
import { aggregatePriorities, aggregateQuestion, dailySeries, type SubmissionLike } from "@/domain/aggregates";
import { addToTally, emptyTally, profileFromTally } from "@/lib/research-tally";
import { reportFromTally } from "@/lib/research-report";
import { aggregateFeedback } from "@/domain/aggregates";
import type { CandidatePosition } from "@/domain/types";

const positions: CandidatePosition[] = CANDIDATES.flatMap((c, ci) =>
  QUESTIONS.map((q) => ({
    id: `${c.id}-${q.id}`, candidateId: c.id, questionId: q.id, direction: "SUPPORTS", closestOptionId: q.options[ci ? q.options.length - 2 : 0].id,
    summary: "", evidenceIds: [], reviewStatus: "PUBLISHED",
  }) as unknown as CandidatePosition),
);

/** Envios fictícios variados (gerador fixo para o teste ser sempre igual). */
function fake(n: number): SubmissionLike[] {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  return Array.from({ length: n }, (_, i) => ({
    id: `s${String(i).padStart(5, "0")}`,
    submittedAt: new Date(Date.UTC(2026, 9, 1 + (i % 9), 12)).toISOString(),
    methodologyVersion: "1.3.0",
    answers: QUESTIONS.filter(() => rnd() > 0.15).map((q) => ({ questionId: q.id, optionIds: [q.options[Math.floor(rnd() * q.options.length)].id] })),
    topicPriorities: TOPICS.filter(() => rnd() > 0.5).map((t) => ({ topicId: t.id, level: Math.floor(rnd() * 5) as 0 | 1 | 2 | 3 | 4 })),
    optionalAgeRange: null,
    optionalRegion: null,
  }));
}

describe("contagens acumuladas do painel", () => {
  const subs = fake(300);

  it("somar em lotes dá o mesmo que somar tudo de uma vez", () => {
    const whole = addToTally(emptyTally(), subs, CANDIDATES, positions);
    const parts = emptyTally();
    for (let i = 0; i < subs.length; i += 37) addToTally(parts, subs.slice(i, i + 37), CANDIDATES, positions);
    expect(parts).toEqual(whole);
  });

  it("bate com o cálculo antigo (perguntas, prioridades, dias e mais perto nos temas)", () => {
    const t = addToTally(emptyTally(), subs, CANDIDATES, positions);
    const r = reportFromTally(t, aggregateFeedback([]), profileFromTally(t, CANDIDATES));
    for (const q of r.questions) {
      const old = aggregateQuestion(q.questionId, QUESTIONS.find((x) => x.id === q.questionId)!.options.map((o) => o.id), subs);
      expect(q.totalResponses).toBe(old.totalResponses);
      expect(q.options.map((o) => [o.count, o.shareOfResponses])).toEqual(old.options.map((o) => [o.count, o.shareOfResponses]));
    }
    expect(r.priorities.map(({ topicId, totalResponses, byLevel, shareHighPriority }) => ({ topicId, totalResponses, byLevel, shareHighPriority }))).toEqual(aggregatePriorities(TOPICS.map((x) => x.id), subs));
    expect(r.timeline).toEqual(dailySeries(subs));
    expect(r.profileProximity).toEqual(aggregateProfileProximity(subs, QUESTIONS, CANDIDATES, positions));
  });

  it("as contagens não crescem com o número de envios", () => {
    const small = JSON.stringify(addToTally(emptyTally(), subs.slice(0, 30), CANDIDATES, positions)).length;
    const big = JSON.stringify(addToTally(emptyTally(), fake(3000), CANDIDATES, positions)).length;
    expect(big).toBeLessThan(small * 1.5);
  });
});
