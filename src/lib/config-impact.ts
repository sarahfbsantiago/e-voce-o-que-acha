import type { Candidate, CandidatePosition, UserAnswer } from "@/domain/types";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { profileProximity } from "@/domain/profile-proximity";
import { themeProximity } from "@/domain/theme-proximity";
import { closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";
import { CANDIDATE_SHORT, withConfig, type LiveConfig } from "@/lib/live-config";

type Sub = { answers: UserAnswer[] };

interface Snapshot {
  questions: number;
  topics: number;
  ideology: (string | null)[];
  ruler: (string | null)[];
  profile: (string | null)[];
  themes: Record<string, (string | null)[]>;
}

/** Fotografia das métricas com a configuração aplicada agora (síncrono). */
function snapshot(subs: Sub[], candidates: Candidate[], positions: CandidatePosition[]): Snapshot {
  const ids = candidates.map((c) => c.id);
  const topics = TOPICS.filter((t) => QUESTIONS.some((q) => q.topicId === t.id));
  const themes: Record<string, (string | null)[]> = Object.fromEntries(topics.map((t) => [t.id, []]));
  const ideology: (string | null)[] = [], ruler: (string | null)[] = [], profile: (string | null)[] = [];
  for (const s of subs) {
    const p = personSpectrum(s.answers);
    ideology.push(p?.ideology ?? null);
    ruler.push(p ? closestCandidateOnRuler(p.at, ids) : null);
    const pp = profileProximity(QUESTIONS, s.answers, candidates, positions);
    profile.push(pp.closestCandidateId ?? (pp.reason === "TIE" ? "empate" : null));
    for (const t of topics) themes[t.id].push(themeProximity(QUESTIONS.filter((q) => q.topicId === t.id), s.answers, candidates, positions).closestCandidateId ?? null);
  }
  return { questions: QUESTIONS.length, topics: topics.length, ideology, ruler, profile, themes };
}

const share = (arr: (string | null)[], v: string) => {
  const base = arr.filter((x) => x !== null).length;
  return base ? Math.round((arr.filter((x) => x === v).length / base) * 1000) / 10 : null;
};

export interface Impact {
  total: number;
  questions: { before: number; after: number };
  topics: { before: number; after: number };
  ideologyChanged: number;
  ideologyMoves: { from: string; to: string; count: number }[];
  ruler: { candidate: string; before: number | null; after: number | null }[];
  rulerChanged: number;
  profile: { candidate: string; before: number | null; after: number | null }[];
  profileChanged: number;
  themes: { topic: string; changed: number }[];
  /** Frases curtas para o histórico e a tela de confirmação. */
  summary: string[];
}

/** Compara as métricas com `from` e com `to`, usando os questionários reais. Volta para `restore` no fim. */
export function computeImpact(subs: Sub[], candidates: Candidate[], positions: CandidatePosition[], from: LiveConfig, to: LiveConfig, restore: LiveConfig): Impact {
  const a = withConfig(from, restore, () => snapshot(subs, candidates, positions));
  const b = withConfig(to, restore, () => snapshot(subs, candidates, positions));
  const changed = (x: (string | null)[], y: (string | null)[]) => x.reduce((n, v, i) => n + (v !== y[i] ? 1 : 0), 0);
  const moves = new Map<string, number>();
  a.ideology.forEach((v, i) => { if (v !== b.ideology[i]) { const k = `${v ?? "sem posição"}→${b.ideology[i] ?? "sem posição"}`; moves.set(k, (moves.get(k) ?? 0) + 1); } });
  const ids = candidates.map((c) => c.id);
  const themeIds = [...new Set([...Object.keys(a.themes), ...Object.keys(b.themes)])];
  const impact: Impact = {
    total: subs.length,
    questions: { before: a.questions, after: b.questions },
    topics: { before: a.topics, after: b.topics },
    ideologyChanged: changed(a.ideology, b.ideology),
    ideologyMoves: [...moves.entries()].map(([k, count]) => { const [f, t] = k.split("→"); return { from: f, to: t, count }; }).sort((x, y) => y.count - x.count).slice(0, 6),
    ruler: ids.map((id) => ({ candidate: id, before: share(a.ruler, id), after: share(b.ruler, id) })),
    rulerChanged: changed(a.ruler, b.ruler),
    profile: ids.map((id) => ({ candidate: id, before: share(a.profile, id), after: share(b.profile, id) })),
    profileChanged: changed(a.profile, b.profile),
    themes: themeIds.map((t) => ({ topic: TOPICS.find((x) => x.id === t)?.name ?? t, changed: changed(a.themes[t] ?? subs.map(() => null), b.themes[t] ?? subs.map(() => null)) })).filter((t) => t.changed > 0),
    summary: [],
  };
  const pct = (n: number | null) => (n === null ? "—" : `${String(n).replace(".", ",")}%`);
  const s = impact.summary;
  if (impact.questions.before !== impact.questions.after) s.push(`Perguntas: ${impact.questions.before} → ${impact.questions.after}`);
  if (impact.topics.before !== impact.topics.after) s.push(`Temas com perguntas: ${impact.topics.before} → ${impact.topics.after}`);
  if (impact.ideologyChanged) s.push(`Ideologia muda para ${impact.ideologyChanged} de ${impact.total} questionários`);
  for (const r of impact.ruler) if (r.before !== r.after) s.push(`Mais perto de ${CANDIDATE_SHORT[r.candidate] ?? r.candidate} na régua: ${pct(r.before)} → ${pct(r.after)}`);
  for (const r of impact.profile) if (r.before !== r.after) s.push(`Mais perto de ${CANDIDATE_SHORT[r.candidate] ?? r.candidate} nos temas: ${pct(r.before)} → ${pct(r.after)}`);
  for (const t of impact.themes) s.push(`Tema ${t.topic}: resultado muda para ${t.changed} questionários`);
  if (impact.rulerChanged && !impact.ruler.some((r) => r.before !== r.after)) s.push(`Lado na régua muda para ${impact.rulerChanged} questionários`);
  if (!s.length) s.push(`Nenhuma métrica dos ${impact.total} questionários já enviados muda`);
  return impact;
}
