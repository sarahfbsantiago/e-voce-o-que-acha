/**
 * Régua do espectro político do relatório (revisão humana da responsável, 09/10/2026).
 * Escala de 0 a 8: cada faixa ocupa 1 unidade (meio da faixa = n,5; divisa entre faixas = número inteiro).
 * A pessoa fica na ideologia do candidato que ficou mais próximo dela em mais temas; em empate, entre os dois.
 */
export const SPECTRUM_BANDS = [
  { label: "Extrema esquerda", color: "#ec4899" },
  { label: "Esquerda", color: "#a855f7" },
  { label: "Centro-esquerda", color: "#6366f1" },
  { label: "Centro", color: "#38bdf8" },
  { label: "Centro-direita", color: "#22c55e" },
  { label: "Direita", color: "#facc15" },
  { label: "Direita radical", color: "#f97316" },
  { label: "Extrema direita", color: "#ef4444" },
] as const;

/** Onde cada candidato fica na régua, com a descrição definida pela responsável e o nome curto da ideologia. */
export const CANDIDATE_SPECTRUM: Record<string, { at: number; label: string; ideology: string }> = {
  lula: { at: 3, label: "Progressista, entre centro-esquerda e centro", ideology: "Progressismo" },
  "flavio-bolsonaro": { at: 7.5, label: "Extrema direita", ideology: "Extrema direita" },
};

export interface PersonSpectrum { at: number; ideology: string; closestCandidateId: string | null }

/** Posição da pessoa: a do candidato com mais temas; empate fica no meio dos dois; sem tema decidido, sem posição. */
export function personSpectrum(themesByCandidate: { candidateId: string; themes: number }[]): PersonSpectrum | null {
  const known = themesByCandidate.filter((t) => CANDIDATE_SPECTRUM[t.candidateId]);
  if (!known.some((t) => t.themes > 0)) return null;
  const top = Math.max(...known.map((t) => t.themes));
  const leaders = known.filter((t) => t.themes === top);
  if (leaders.length === 1) {
    const spot = CANDIDATE_SPECTRUM[leaders[0].candidateId];
    return { at: spot.at, ideology: spot.ideology, closestCandidateId: leaders[0].candidateId };
  }
  const at = leaders.reduce((n, t) => n + CANDIDATE_SPECTRUM[t.candidateId].at, 0) / leaders.length;
  return { at, ideology: "Equivalente entre os dois", closestCandidateId: null };
}

/** Nome da faixa; numa divisa, "entre X e Y". */
export function bandAt(position: number): string {
  const n = SPECTRUM_BANDS.length;
  if (Number.isInteger(position) && position > 0 && position < n) return `entre ${SPECTRUM_BANDS[position - 1].label.toLowerCase()} e ${SPECTRUM_BANDS[position].label.toLowerCase()}`;
  return SPECTRUM_BANDS[Math.min(n - 1, Math.max(0, Math.floor(position)))].label;
}
