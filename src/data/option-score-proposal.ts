/**
 * PROPOSTA (ainda não aplicada na conta): nota de cada candidato em cada alternativa, de 0 a 1.
 * Hoje a regra é: 1 na alternativa do candidato, 0,5 na vizinha, 0 nas demais.
 * Aqui ficam só as notas que mudariam, com o motivo tirado dos textos "Visão Lula" e "Visão Flávio".
 * Chave: "pergunta|candidato|alternativa" (ex.: "q23|lula|o1"). Exibida só no painel admin (/admin/notas).
 */
export const OPTION_SCORE_PROPOSAL: Record<string, [score: number, reason: string]> = {
  "q03|lula|o1": [0.5, "Mantém as principais políticas sociais"], "q03|lula|o2": [0.5, "Mantém o arcabouço fiscal"],
  "q01|flavio-bolsonaro|o3": [0, "Revisão humana: não defende 'Discordo em parte'"], "q01|flavio-bolsonaro|o4": [0.5, "Revisão humana: defende 'Discordo' em parte"],
  "q03|flavio-bolsonaro|o1": [0, "Revisão humana, pelas fontes: defende gastar menos"], "q03|flavio-bolsonaro|o3": [0, "Revisão humana, pelas fontes: protege primeiro as contas públicas"],
  "q16|lula|o1": [0.5, "Alfabetização e Escola em Tempo Integral"], "q16|lula|o2": [0.5, "Pé-de-Meia no ensino médio"], "q16|lula|o3": [0.5, "Institutos Federais"], "q16|lula|o4": [0.5, "Expansão das universidades"],
  "q16|flavio-bolsonaro|o5": [0.5, "Combinação inclui a escolha dele"],
  "q20|lula|o1": [0.5, "Bolsa Família"], "q20|lula|o2": [0.5, "Qualificação profissional"], "q20|lula|o3": [0.5, "Valorização do salário mínimo"],
  "q20|flavio-bolsonaro|o3": [0, "Aumento de salários não aparece no texto"], "q20|flavio-bolsonaro|o5": [0.5, "Combinação inclui a escolha dele"],
  "q23|lula|o1": [0.5, "Lei Antifacção e presídios"], "q23|flavio-bolsonaro|o2": [0, "Prevenção não aparece no texto"], "q23|flavio-bolsonaro|o3": [0.5, "Combinação inclui a escolha dele"],
  "q27|flavio-bolsonaro|o2": [0, "Tratamento de saúde não aparece no texto"], "q27|flavio-bolsonaro|o4": [0.5, "Combinação inclui a escolha dele"],
  "q33|lula|o1": [0.5, "Ampliar renováveis"], "q33|lula|o2": [0.5, "Mantém petróleo e gás na transição"], "q33|lula|o3": [0, "Nuclear não aparece no texto"],
  "q33|flavio-bolsonaro|o1": [0, "Renováveis não aparecem no texto"], "q33|flavio-bolsonaro|o3": [0, "Nuclear não aparece no texto"], "q33|flavio-bolsonaro|o4": [0.5, "Combinação inclui a escolha dele"],
  "q44|lula|o2": [0, "Sem alinhamento com um bloco"], "q44|lula|o3": [0.5, "BRICS e países emergentes"], "q44|lula|o4": [0.5, "Sem alinhamento exclusivo"],
  "q44|flavio-bolsonaro|o3": [0, "Critica posições do Brasil no BRICS"],
  "q46|lula|o1": [0.5, "Acordo Mercosul–União Europeia"], "q46|lula|o2": [0.5, "Nova Indústria Brasil"],
  "q46|flavio-bolsonaro|o2": [0, "Proteção não aparece no texto"], "q46|flavio-bolsonaro|o3": [0.5, "Combinação inclui a escolha dele"],
};
