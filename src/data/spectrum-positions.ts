import type { SpectrumBandLabel } from "./political-spectrum";

/**
 * Faixa da régua do espectro político para onde cada alternativa aponta (tabela visível só em /admin/espectro).
 * Independe dos candidatos: serve só para localizar a ideologia da pessoa. "Não sei" nunca entra.
 * Chave: "pergunta|alternativa" (ex.: "q01|o1"). Admin e calculadora sempre juntos.
 * Proposta inicial de 09/10/2026; o que a responsável revisar fica como "Revisão humana".
 */
export const SPECTRUM_POSITIONS: Record<string, [band: SpectrumBandLabel, reason: string]> = {
  // Economia e trabalho
  "q01|o1": ["Esquerda", "Proposta"], "q01|o2": ["Centro-esquerda", "Proposta"], "q01|o3": ["Centro-direita", "Proposta"], "q01|o4": ["Direita", "Proposta"],
  "q03|o1": ["Esquerda", "Proposta"], "q03|o2": ["Direita", "Proposta"], "q03|o3": ["Centro", "Proposta"],
  "q05|o1": ["Esquerda", "Proposta"], "q05|o2": ["Centro", "Proposta"], "q05|o3": ["Direita", "Proposta"],
  "q08|o1": ["Esquerda", "Proposta"], "q08|o2": ["Centro", "Proposta"], "q08|o3": ["Direita", "Proposta"],
  "q36|o1": ["Centro-esquerda", "Proposta"], "q36|o2": ["Centro", "Proposta"], "q36|o3": ["Direita", "Proposta"],
  // Social: saúde, educação e renda
  "q09|o1": ["Esquerda", "Proposta"], "q09|o2": ["Centro-direita", "Proposta"], "q09|o3": ["Direita", "Proposta"],
  "q11|o1": ["Esquerda", "Proposta"], "q11|o2": ["Centro", "Proposta"], "q11|o3": ["Direita", "Proposta"],
  "q13|o1": ["Centro-esquerda", "Proposta"], "q13|o2": ["Centro", "Proposta"], "q13|o3": ["Direita", "Proposta"],
  "q17|o1": ["Esquerda", "Proposta"], "q17|o2": ["Centro", "Proposta"], "q17|o3": ["Centro-direita", "Proposta"], "q17|o4": ["Direita", "Proposta"],
  "q20|o1": ["Esquerda", "Proposta"], "q20|o2": ["Centro-direita", "Proposta"], "q20|o3": ["Centro-esquerda", "Proposta"], "q20|o4": ["Centro-esquerda", "Revisão humana"], "q20|o7": ["Centro-direita", "Proposta"], "q20|o5": ["Centro", "Proposta"],
  // Segurança
  "q21|o1": ["Centro", "Proposta"], "q21|o2": ["Centro", "Proposta"], "q21|o3": ["Centro", "Proposta"], "q21|o4": ["Centro-direita", "Proposta"],
  "q23|o1": ["Direita", "Proposta"], "q23|o2": ["Esquerda", "Proposta"], "q23|o3": ["Centro", "Proposta"],
  "q25|o1": ["Esquerda", "Proposta"], "q25|o2": ["Centro", "Proposta"], "q25|o3": ["Direita", "Proposta"],
  "q27|o1": ["Direita", "Proposta"], "q27|o2": ["Esquerda", "Proposta"], "q27|o3": ["Centro-esquerda", "Proposta"], "q27|o4": ["Centro", "Proposta"],
  "q28|o1": ["Centro", "Proposta"], "q28|o2": ["Centro-esquerda", "Proposta"], "q28|o3": ["Centro-direita", "Proposta"], "q28|o4": ["Direita", "Proposta"],
  // Ambiente e tecnologia
  "q30|o1": ["Esquerda", "Proposta"], "q30|o2": ["Centro", "Proposta"], "q30|o3": ["Direita", "Proposta"],
  "q31|o1": ["Esquerda", "Proposta"], "q31|o2": ["Centro-direita", "Proposta"], "q31|o3": ["Direita", "Proposta"],
  "q32|o1": ["Esquerda", "Proposta"], "q32|o2": ["Centro", "Proposta"], "q32|o3": ["Direita", "Proposta"],
  "q33|o1": ["Centro-esquerda", "Proposta"], "q33|o2": ["Direita", "Proposta"], "q33|o3": ["Centro", "Proposta"], "q33|o4": ["Centro", "Proposta"],
  "q38|o1": ["Centro", "Proposta"], "q38|o2": ["Centro", "Proposta"], "q38|o3": ["Centro-direita", "Proposta"],
  // Instituições e mundo
  "q43|o1": ["Centro-esquerda", "Proposta"], "q43|o2": ["Centro-direita", "Proposta"], "q43|o3": ["Centro-direita", "Proposta"],
  "q45|o1": ["Esquerda", "Proposta"], "q45|o2": ["Centro", "Proposta"], "q45|o3": ["Direita", "Proposta"],
  "q53|o1": ["Centro-direita", "Proposta"], "q53|o2": ["Centro", "Proposta"], "q53|o3": ["Centro-esquerda", "Proposta"],
  "q51|o1": ["Centro-esquerda", "Proposta"], "q51|o2": ["Centro-direita", "Proposta"], "q51|o3": ["Direita", "Proposta"],
  "q52|o1": ["Centro-esquerda", "Proposta"], "q52|o2": ["Centro-direita", "Proposta"], "q52|o3": ["Direita", "Proposta"],
};

export function spectrumPositionOf(questionId: string, optionId: string): { band: SpectrumBandLabel; reason: string } | null {
  const v = SPECTRUM_POSITIONS[`${questionId}|${optionId.split("-").pop()}`];
  return v ? { band: v[0], reason: v[1] } : null;
}
