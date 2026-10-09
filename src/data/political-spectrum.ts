/**
 * Régua do espectro político do relatório (revisão humana da responsável, 09/10/2026).
 * Escala de 0 a 8: cada faixa ocupa 1 unidade. A posição da pessoa sai do resultado do relatório:
 * fica entre os dois candidatos, na proporção dos temas em que cada um ficou mais próximo.
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

/** Onde cada candidato fica na régua, com a descrição curta definida pela responsável. */
export const CANDIDATE_SPECTRUM: Record<string, { at: number; label: string }> = {
  lula: { at: 3, label: "Progressista, entre centro-esquerda e centro" },
  "flavio-bolsonaro": { at: 7.5, label: "Extrema direita" },
};

/**
 * Posição da pessoa: média das posições dos candidatos, pesada pelos temas em que cada um ficou mais próximo.
 * Sem tema decidido, não há posição.
 */
export function personSpectrumPosition(themesByCandidate: { candidateId: string; themes: number }[]): number | null {
  const known = themesByCandidate.filter((t) => CANDIDATE_SPECTRUM[t.candidateId]);
  const total = known.reduce((n, t) => n + t.themes, 0);
  if (!total) return null;
  return known.reduce((sum, t) => sum + CANDIDATE_SPECTRUM[t.candidateId].at * t.themes, 0) / total;
}

export function bandAt(position: number): string {
  const i = Math.min(SPECTRUM_BANDS.length - 1, Math.max(0, Math.floor(position)));
  return SPECTRUM_BANDS[i].label;
}
