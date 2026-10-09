/**
 * Posição de cada alternativa na régua do espectro político (tabela visível só em /admin/espectro).
 * Escala de −2 (esquerda) a +2 (direita); 0 = centro. "Não sei" nunca entra.
 * Independe dos candidatos: serve só para localizar a ideologia da pessoa na régua.
 * Chave: "pergunta|alternativa" (ex.: "q01|o1"). Admin e calculadora sempre juntos.
 * Proposta inicial de 09/10/2026, aguardando revisão humana da responsável.
 */
export const SPECTRUM_POSITIONS: Record<string, [position: number, reason: string]> = {
  // Economia e trabalho
  "q01|o1": [-2, "Proposta"], "q01|o2": [-1, "Proposta"], "q01|o3": [1, "Proposta"], "q01|o4": [2, "Proposta"],
  "q03|o1": [-2, "Proposta"], "q03|o2": [2, "Proposta"], "q03|o3": [0, "Proposta"],
  "q05|o1": [-2, "Proposta"], "q05|o2": [0, "Proposta"], "q05|o3": [2, "Proposta"],
  "q08|o1": [-2, "Proposta"], "q08|o2": [0, "Proposta"], "q08|o3": [2, "Proposta"],
  "q36|o1": [-1, "Proposta"], "q36|o2": [0.5, "Proposta"], "q36|o3": [2, "Proposta"],
  // Social: saúde, educação e renda
  "q09|o1": [-2, "Proposta"], "q09|o2": [1, "Proposta"], "q09|o3": [2, "Proposta"],
  "q11|o1": [-2, "Proposta"], "q11|o2": [0, "Proposta"], "q11|o3": [2, "Proposta"],
  "q13|o1": [-1, "Proposta"], "q13|o2": [0.5, "Proposta"], "q13|o3": [2, "Proposta"],
  "q17|o1": [-2, "Proposta"], "q17|o2": [0, "Proposta"], "q17|o3": [1, "Proposta"], "q17|o4": [2, "Proposta"],
  "q20|o1": [-2, "Proposta"], "q20|o2": [1, "Proposta"], "q20|o3": [-1, "Proposta"], "q20|o4": [0, "Proposta"], "q20|o7": [1, "Proposta"], "q20|o5": [0, "Proposta"],
  // Segurança
  "q21|o1": [-0.5, "Proposta"], "q21|o2": [0, "Proposta"], "q21|o3": [0.5, "Proposta"], "q21|o4": [1, "Proposta"],
  "q23|o1": [2, "Proposta"], "q23|o2": [-2, "Proposta"], "q23|o3": [0, "Proposta"],
  "q25|o1": [-2, "Proposta"], "q25|o2": [0, "Proposta"], "q25|o3": [2, "Proposta"],
  "q27|o1": [2, "Proposta"], "q27|o2": [-2, "Proposta"], "q27|o3": [-1, "Proposta"], "q27|o4": [0, "Proposta"],
  "q28|o1": [0.5, "Proposta"], "q28|o2": [-1, "Proposta"], "q28|o3": [1, "Proposta"], "q28|o4": [2, "Proposta"],
  // Ambiente e tecnologia
  "q30|o1": [-2, "Proposta"], "q30|o2": [0, "Proposta"], "q30|o3": [2, "Proposta"],
  "q31|o1": [-2, "Proposta"], "q31|o2": [1, "Proposta"], "q31|o3": [2, "Proposta"],
  "q32|o1": [-2, "Proposta"], "q32|o2": [0.5, "Proposta"], "q32|o3": [2, "Proposta"],
  "q33|o1": [-1, "Proposta"], "q33|o2": [2, "Proposta"], "q33|o3": [0.5, "Proposta"], "q33|o4": [0, "Proposta"],
  "q38|o1": [0, "Proposta"], "q38|o2": [0, "Proposta"], "q38|o3": [1, "Proposta"],
  // Instituições e mundo
  "q43|o1": [-1, "Proposta"], "q43|o2": [1, "Proposta"], "q43|o3": [1, "Proposta"],
  "q45|o1": [-2, "Proposta"], "q45|o2": [0.5, "Proposta"], "q45|o3": [2, "Proposta"],
  "q53|o1": [1, "Proposta"], "q53|o2": [0, "Proposta"], "q53|o3": [-1, "Proposta"],
  "q51|o1": [-1, "Proposta"], "q51|o2": [1, "Proposta"], "q51|o3": [2, "Proposta"],
  "q52|o1": [-1, "Proposta"], "q52|o2": [1, "Proposta"], "q52|o3": [2, "Proposta"],
};

export function spectrumPositionOf(questionId: string, optionId: string): { position: number; reason: string } | null {
  const v = SPECTRUM_POSITIONS[`${questionId}|${optionId.split("-").pop()}`];
  return v ? { position: v[0], reason: v[1] } : null;
}
