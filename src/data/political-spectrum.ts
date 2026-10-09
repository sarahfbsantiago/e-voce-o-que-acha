import { spectrumPositionOf } from "./spectrum-positions";
import { SPECTRUM_TERMS } from "./spectrum-terms";

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

export type SpectrumBandLabel = (typeof SPECTRUM_BANDS)[number]["label"];

/** Meio da faixa na régua (0 a 8): Extrema esquerda 0,5 … Centro 3,5 … Extrema direita 7,5. */
export function bandCenter(label: SpectrumBandLabel): number {
  return SPECTRUM_BANDS.findIndex((b) => b.label === label) + 0.5;
}

/** Onde cada candidato fica na régua, com a descrição definida pela responsável e o nome curto da ideologia. */
export const CANDIDATE_SPECTRUM: Record<string, { at: number; label: string; ideology: string }> = {
  lula: { at: 3.15, label: "Progressista, entre centro-esquerda e centro", ideology: "Progressismo" },
  "flavio-bolsonaro": { at: 7.8, label: "Extrema direita", ideology: "Extrema direita" },
};

/** Ideologia mostrada para a pessoa, pelo trecho da régua (0 a 8) onde ela cai; acompanha as faixas. */
export const IDEOLOGY_RANGES: { upTo: number; label: string }[] = [
  { upTo: 1, label: "Comunismo" },
  { upTo: 2, label: "Socialismo" },
  { upTo: 2.75, label: "Social-democracia" },
  { upTo: 3.4, label: "Progressismo" },
  { upTo: 4, label: "Centro político" },
  { upTo: 5, label: "Liberalismo social" },
  { upTo: 6, label: "Liberalismo econômico e conservadorismo" },
  { upTo: 7, label: "Nacionalismo radical" },
  { upTo: Infinity, label: "Fascismo" },
];

/** Largura de cada faixa no desenho da régua: extremos bem mais largos, centro-esquerda e centro-direita mais estreitas. */
export const RULER_WIDTHS = [2.4, 1, 0.7, 1, 0.7, 1, 1, 2.4];
const RULER_TOTAL = RULER_WIDTHS.reduce((n, w) => n + w, 0);
/** Ponto da régua (0 a 8, em faixas) → posição no desenho, em % da largura. */
export function rulerPct(at: number): number {
  const n = SPECTRUM_BANDS.length;
  const i = Math.min(n - 1, Math.max(0, Math.floor(at)));
  const before = RULER_WIDTHS.slice(0, i).reduce((s, w) => s + w, 0);
  return ((before + (at - i) * RULER_WIDTHS[i]) / RULER_TOTAL) * 100;
}

/**
 * De qual candidato a ideologia da pessoa está mais próxima: a menor distância no desenho da régua.
 * Assim, só quem fica de nacionalismo radical para a direita fica mais perto de Flávio; os demais, de Lula.
 */
export function closestCandidateOnRuler(at: number, candidateIds: string[]): string | null {
  const known = candidateIds.filter((id) => CANDIDATE_SPECTRUM[id]);
  if (!known.length) return null;
  const d = known.map((id) => ({ id, d: Math.abs(rulerPct(CANDIDATE_SPECTRUM[id].at) - rulerPct(at)) })).sort((a, b) => a.d - b.d);
  return d.length > 1 && d[0].d === d[1].d ? null : d[0].id;
}

export interface PersonSpectrum { at: number; mean: number; ideology: string; counted: number }

/** Ponto da régua de cada ideologia mostrada: o mesmo ponto para onde a seta do termo aponta. */
const IDEOLOGY_SPOT: Record<string, string> = { "Liberalismo econômico e conservadorismo": "Liberalismo econômico" };
export function ideologySpot(ideology: string): number | null {
  return SPECTRUM_TERMS.find((t) => t.label === (IDEOLOGY_SPOT[ideology] ?? ideology))?.at ?? null;
}

/**
 * Posição da pessoa: média do meio das faixas para onde apontam as alternativas que ela marcou, sem "Não sei".
 * A média define a ideologia; a seta fica no ponto dessa ideologia na régua.
 * Sem nenhuma resposta com faixa, sem posição.
 */
export function personSpectrum(answers: { questionId: string; optionIds: string[] }[]): PersonSpectrum | null {
  const values: number[] = [];
  for (const a of answers) {
    const vs = a.optionIds.map((o) => spectrumPositionOf(a.questionId, o)).filter((v) => v !== null).map((v) => bandCenter(v.band));
    if (vs.length) values.push(vs.reduce((n, v) => n + v, 0) / vs.length);
  }
  if (!values.length) return null;
  const mean = values.reduce((n, v) => n + v, 0) / values.length;
  const ideology = IDEOLOGY_RANGES.find((r) => mean <= r.upTo)!.label;
  // a seta "Você" vai para o mesmo ponto da ideologia na régua
  return { at: ideologySpot(ideology) ?? mean, mean, counted: values.length, ideology };
}

/** Nome da faixa; numa divisa, "entre X e Y". */
export function bandAt(position: number): string {
  const n = SPECTRUM_BANDS.length;
  if (Number.isInteger(position) && position > 0 && position < n) return `entre ${SPECTRUM_BANDS[position - 1].label.toLowerCase()} e ${SPECTRUM_BANDS[position].label.toLowerCase()}`;
  return SPECTRUM_BANDS[Math.min(n - 1, Math.max(0, Math.floor(position)))].label;
}
