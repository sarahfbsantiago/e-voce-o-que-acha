import type { Candidate, CandidatePosition } from "@/domain/types";
import type { SubmissionLike } from "@/domain/aggregates";
import { QUESTIONS } from "@/data/questions";
import { profileProximity, type ProfileProximityAggregate } from "@/domain/profile-proximity";
import { CANDIDATE_SPECTRUM, IDEOLOGY_RANGES, SPECTRUM_BANDS, closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";

/**
 * Contagens do painel da pesquisa que podem ser somadas aos poucos: cada envio entra uma vez e o resultado
 * é o mesmo de contar tudo de novo. Só números, sem registro individual. Cabe em poucos kB com qualquer volume.
 */
export interface ResearchTally {
  total: number;
  completed: number;
  /** por pergunta: quantos responderam e quantos marcaram cada alternativa */
  questions: Record<string, { n: number; o: Record<string, number> }>;
  /** por tema: contagem por nível de importância 0..4 */
  priorities: Record<string, number[]>;
  days: Record<string, number>;
  age: Record<string, number>;
  region: Record<string, number>;
  ideology: { total: number; by: Record<string, number>; bands: number[]; closer: Record<string, number> };
  profile: { total: number; noComparison: number; ties: number; c: Record<string, { count: number; agreeSum: number; agreeN: number }> };
}

export function emptyTally(): ResearchTally {
  return {
    total: 0, completed: 0, questions: {}, priorities: {}, days: {}, age: {}, region: {},
    ideology: { total: 0, by: {}, bands: SPECTRUM_BANDS.map(() => 0), closer: {} },
    profile: { total: 0, noComparison: 0, ties: 0, c: {} },
  };
}

const inc = (m: Record<string, number>, k: string, n = 1) => { m[k] = (m[k] ?? 0) + n; };

/** Soma um lote de envios, com a configuração aplicada agora (perguntas, notas, régua) e as posições publicadas. */
export function addToTally(t: ResearchTally, subs: SubmissionLike[], candidates: Candidate[], positions: CandidatePosition[] | null) {
  const current = new Set(QUESTIONS.map((q) => q.id));
  const ids = Object.keys(CANDIDATE_SPECTRUM);
  for (const s of subs) {
    t.total++;
    // só contam as perguntas atuais: envios antigos podem ter respostas de perguntas removidas
    if (s.answers.filter((a) => current.has(a.questionId)).length >= QUESTIONS.length) t.completed++;
    for (const a of s.answers) {
      if (!a.optionIds.length) continue;
      const q = (t.questions[a.questionId] ??= { n: 0, o: {} });
      q.n++;
      for (const oid of a.optionIds) inc(q.o, oid);
    }
    for (const p of s.topicPriorities) (t.priorities[p.topicId] ??= [0, 0, 0, 0, 0])[p.level]++;
    inc(t.days, s.submittedAt.slice(0, 10));
    if (s.optionalAgeRange) inc(t.age, s.optionalAgeRange);
    if (s.optionalRegion) inc(t.region, s.optionalRegion);
    const sp = personSpectrum(s.answers);
    if (sp) {
      t.ideology.total++;
      inc(t.ideology.by, sp.ideology);
      t.ideology.bands[Math.min(SPECTRUM_BANDS.length - 1, Math.max(0, Math.floor(sp.at)))]++;
      const c = closestCandidateOnRuler(sp.at, ids);
      if (c) inc(t.ideology.closer, c);
    }
    if (positions) {
      const o = profileProximity(QUESTIONS, s.answers, candidates, positions);
      t.profile.total++;
      if (o.reason === "NO_COMPARISON") t.profile.noComparison++;
      if (o.reason === "TIE") t.profile.ties++;
      for (const c of candidates) {
        const e = (t.profile.c[c.id] ??= { count: 0, agreeSum: 0, agreeN: 0 });
        if (o.closestCandidateId === c.id) e.count++;
        const ag = o.totals.find((x) => x.candidateId === c.id)?.agreement ?? null;
        if (ag !== null) { e.agreeSum += ag; e.agreeN++; }
      }
    }
  }
  return t;
}

/** Bloco "mais perto nos temas" a partir das contagens (mesmo formato de aggregateProfileProximity). */
export function profileFromTally(t: ResearchTally, candidates: Candidate[]): ProfileProximityAggregate {
  const withComparison = t.profile.total - t.profile.noComparison;
  return {
    total: t.profile.total,
    withComparison,
    byCandidate: candidates.map((c) => {
      const e = t.profile.c[c.id] ?? { count: 0, agreeSum: 0, agreeN: 0 };
      return {
        candidateId: c.id,
        count: e.count,
        share: withComparison ? Math.round((e.count / withComparison) * 1000) / 10 : null,
        meanAgreement: e.agreeN ? Math.round((e.agreeSum / e.agreeN) * 10) / 10 : null,
      };
    }),
    ties: t.profile.ties,
    noComparison: t.profile.noComparison,
  };
}

/** Bloco da régua a partir das contagens (mesmo formato de antes). */
export function ideologyFromTally(t: ResearchTally) {
  const total = t.ideology.total;
  const share = (n: number) => (total ? Math.round((n / total) * 1000) / 10 : null);
  return {
    total,
    byIdeology: IDEOLOGY_RANGES.map((r) => ({ label: r.label, count: t.ideology.by[r.label] ?? 0, share: share(t.ideology.by[r.label] ?? 0) })),
    byBand: SPECTRUM_BANDS.map((b, i) => ({ label: b.label, color: b.color, count: t.ideology.bands[i] ?? 0, share: share(t.ideology.bands[i] ?? 0) })),
    closerOnRuler: Object.keys(CANDIDATE_SPECTRUM).map((candidateId) => ({ candidateId, count: t.ideology.closer[candidateId] ?? 0, share: share(t.ideology.closer[candidateId] ?? 0) })),
  };
}
