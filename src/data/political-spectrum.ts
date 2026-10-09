import { spectrumPositionOf } from "./spectrum-positions";

/**
 * Régua do espectro político do relatório (revisão humana da responsável, 09/10/2026).
 * Escala de 0 a 8: cada faixa ocupa 1 unidade (meio da faixa = n,5; divisa entre faixas = número inteiro).
 * A pessoa fica onde as respostas dela apontam (tabela src/data/spectrum-positions.ts), independente dos candidatos.
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

/**
 * Ideologia mostrada para a pessoa, por trecho da régua (0 a 8). O ponto neutro (média 0) cai em 4, na divisa entre centro e centro-direita, e conta como centro político.
 * A régua da pessoa vai de 1,5 (esquerda) a 6,5 (direita radical): as 25 perguntas não medem os extremos.
 */
export const IDEOLOGY_RANGES: { upTo: number; label: string }[] = [
  { upTo: 2, label: "Socialismo" },
  { upTo: 2.75, label: "Social-democracia" },
  { upTo: 3.25, label: "Progressismo" },
  { upTo: 4, label: "Centro político" },
  { upTo: 5, label: "Liberalismo social" },
  { upTo: 6, label: "Liberalismo econômico e conservadorismo" },
  { upTo: Infinity, label: "Nacionalismo radical" },
];

export interface PersonSpectrum { at: number; ideology: string; mean: number; counted: number }

/**
 * Posição da pessoa: média das posições (−2 a +2) das alternativas que ela marcou, sem "Não sei",
 * levada para a régua: 4 + média × 1,25 (de 1,5 a 6,5). Sem nenhuma resposta com posição, sem posição.
 */
export function personSpectrum(answers: { questionId: string; optionIds: string[] }[]): PersonSpectrum | null {
  const values: number[] = [];
  for (const a of answers) {
    const vs = a.optionIds.map((o) => spectrumPositionOf(a.questionId, o)?.position).filter((v): v is number => v !== undefined);
    if (vs.length) values.push(vs.reduce((n, v) => n + v, 0) / vs.length);
  }
  if (!values.length) return null;
  const mean = values.reduce((n, v) => n + v, 0) / values.length;
  const at = 4 + mean * 1.25;
  return { at, mean, counted: values.length, ideology: IDEOLOGY_RANGES.find((r) => at <= r.upTo)!.label };
}

/** Nome da faixa; numa divisa, "entre X e Y". */
export function bandAt(position: number): string {
  const n = SPECTRUM_BANDS.length;
  if (Number.isInteger(position) && position > 0 && position < n) return `entre ${SPECTRUM_BANDS[position - 1].label.toLowerCase()} e ${SPECTRUM_BANDS[position].label.toLowerCase()}`;
  return SPECTRUM_BANDS[Math.min(n - 1, Math.max(0, Math.floor(position)))].label;
}
