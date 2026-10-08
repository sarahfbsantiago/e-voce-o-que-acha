/**
 * Notas por alternativa USADAS NA CONTA do site (revisão humana; tabela visível só em /admin/notas).
 * Nota de 0 a 1 que o candidato ganha quando a pessoa marca aquela alternativa.
 * Regra padrão (quando a pergunta não está aqui): 1 na alternativa do candidato, 0,5 na vizinha, 0 nas demais.
 * Quando uma pergunta tem notas aqui para um candidato, as alternativas listadas usam estas notas;
 * as não listadas seguem a regra padrão (ou 0, se o candidato não tiver posição publicada).
 * Chave: "pergunta|candidato|alternativa" (ex.: "q23|lula|o1"). Admin e calculadora sempre juntos.
 */
export const OPTION_SCORES: Record<string, [score: number, reason: string]> = {
  "q03|lula|o1": [0.5, "Mantém as principais políticas sociais"], "q03|lula|o2": [0.5, "Mantém o arcabouço fiscal"],
  "q01|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q02|flavio-bolsonaro|o1": [0, "Revisão humana"], "q02|flavio-bolsonaro|o2": [0, "Revisão humana"], "q02|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q04|flavio-bolsonaro|o1": [0.5, "Revisão humana"], "q04|flavio-bolsonaro|o2": [0.5, "Revisão humana"],
  "q05|flavio-bolsonaro|o1": [0, "Revisão humana"], "q05|flavio-bolsonaro|o2": [0, "Revisão humana"], "q05|flavio-bolsonaro|o3": [1, "Revisão humana"],
  "q08|flavio-bolsonaro|o1": [0, "Revisão humana"], "q08|flavio-bolsonaro|o2": [0, "Revisão humana"], "q08|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q34|flavio-bolsonaro|o1": [0, "Revisão humana"], "q34|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q34|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q35|flavio-bolsonaro|o1": [0, "Revisão humana"], "q35|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q35|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q36|flavio-bolsonaro|o1": [0, "Revisão humana"], "q36|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q36|flavio-bolsonaro|o3": [0, "Revisão humana"], "q01|flavio-bolsonaro|o4": [0.5, "Revisão humana: defende 'Discordo' em parte"],
  "q03|flavio-bolsonaro|o1": [0, "Revisão humana, pelas fontes: defende gastar menos"], "q03|flavio-bolsonaro|o3": [0, "Revisão humana, pelas fontes: protege primeiro as contas públicas"],
  "q16|lula|o1": [0.5, "Alfabetização e Escola em Tempo Integral"], "q16|lula|o2": [0.5, "Pé-de-Meia no ensino médio"], "q16|lula|o3": [0.5, "Institutos Federais"], "q16|lula|o4": [0.5, "Expansão das universidades"],
  "q16|flavio-bolsonaro|o5": [0.5, "Combinação inclui a escolha dele"],
  "q20|lula|o1": [0.5, "Bolsa Família"], "q20|lula|o2": [0.5, "Qualificação profissional"], "q20|lula|o3": [0.5, "Valorização do salário mínimo"],
  "q23|lula|o1": [0.5, "Lei Antifacção e presídios"],
  "q33|lula|o1": [0.5, "Ampliar renováveis"], "q33|lula|o2": [0.5, "Mantém petróleo e gás na transição"], "q33|lula|o3": [0, "Nuclear não aparece no texto"],
  "q33|flavio-bolsonaro|o1": [0, "Renováveis não aparecem no texto"], "q33|flavio-bolsonaro|o3": [0, "Nuclear não aparece no texto"], "q33|flavio-bolsonaro|o4": [0.5, "Combinação inclui a escolha dele"],
  "q44|lula|o2": [0, "Sem alinhamento com um bloco"], "q44|lula|o3": [0.5, "BRICS e países emergentes"], "q44|lula|o4": [0.5, "Sem alinhamento exclusivo"],
  "q44|flavio-bolsonaro|o3": [0, "Critica posições do Brasil no BRICS"],
  "q46|lula|o1": [0.5, "Acordo Mercosul–União Europeia"], "q46|lula|o2": [0.5, "Nova Indústria Brasil"],
  "q46|flavio-bolsonaro|o2": [0, "Proteção não aparece no texto"], "q46|flavio-bolsonaro|o3": [0.5, "Combinação inclui a escolha dele"],
  "q37|flavio-bolsonaro|o1": [0, "Revisão humana"], "q37|flavio-bolsonaro|o2": [0, "Revisão humana"], "q37|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q09|flavio-bolsonaro|o1": [0, "Revisão humana"], "q09|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q09|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q10|flavio-bolsonaro|o1": [0, "Revisão humana"], "q10|flavio-bolsonaro|o2": [0, "Revisão humana"], "q10|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q11|flavio-bolsonaro|o1": [0, "Revisão humana"], "q11|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q11|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q12|flavio-bolsonaro|o1": [0, "Revisão humana"], "q12|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q12|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q13|flavio-bolsonaro|o1": [0, "Revisão humana"], "q13|flavio-bolsonaro|o2": [0, "Revisão humana"], "q13|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q14|flavio-bolsonaro|o1": [0, "Revisão humana"], "q14|flavio-bolsonaro|o2": [0, "Revisão humana"], "q14|flavio-bolsonaro|o3": [0.5, "Revisão humana"],
  "q15|flavio-bolsonaro|o1": [0, "Revisão humana"], "q15|flavio-bolsonaro|o2": [0, "Revisão humana"], "q15|flavio-bolsonaro|o3": [1, "Revisão humana"],
  "q17|flavio-bolsonaro|o1": [0, "Revisão humana"], "q17|flavio-bolsonaro|o2": [0, "Revisão humana"], "q17|flavio-bolsonaro|o3": [0, "Revisão humana"], "q17|flavio-bolsonaro|o4": [0.5, "Revisão humana"],
  "q18|flavio-bolsonaro|o1": [0, "Revisão humana"], "q18|flavio-bolsonaro|o2": [0, "Revisão humana"], "q18|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q20|flavio-bolsonaro|o1": [0, "Revisão humana"], "q20|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q20|flavio-bolsonaro|o3": [0, "Revisão humana"], "q20|flavio-bolsonaro|o4": [0, "Revisão humana"], "q20|flavio-bolsonaro|o5": [0, "Revisão humana"],
  "q21|flavio-bolsonaro|o1": [1, "Revisão humana"], "q21|flavio-bolsonaro|o2": [0, "Revisão humana"], "q21|flavio-bolsonaro|o3": [0, "Revisão humana"], "q21|flavio-bolsonaro|o4": [0, "Revisão humana"],
  "q22|flavio-bolsonaro|o1": [0.5, "Revisão humana"], "q22|flavio-bolsonaro|o2": [0, "Revisão humana"], "q22|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q23|flavio-bolsonaro|o1": [1, "Revisão humana"], "q23|flavio-bolsonaro|o2": [0, "Revisão humana"], "q23|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q26|flavio-bolsonaro|o1": [1, "Revisão humana"], "q26|flavio-bolsonaro|o2": [0, "Revisão humana"], "q26|flavio-bolsonaro|o3": [0, "Revisão humana"],
  "q26|lula|o1": [0, "Revisão humana"], "q26|lula|o2": [0.5, "Revisão humana"], "q26|lula|o3": [0, "Revisão humana"],
  "q27|lula|o1": [0, "Revisão humana"], "q27|lula|o2": [0.5, "Revisão humana"], "q27|lula|o3": [0.5, "Revisão humana"], "q27|lula|o4": [0.5, "Revisão humana"],
  "q27|flavio-bolsonaro|o1": [1, "Revisão humana"], "q27|flavio-bolsonaro|o2": [0, "Revisão humana"], "q27|flavio-bolsonaro|o3": [0, "Revisão humana"], "q27|flavio-bolsonaro|o4": [0, "Revisão humana"],
  "q28|lula|o1": [1, "Revisão humana"], "q28|lula|o2": [0, "Revisão humana"], "q28|lula|o3": [0, "Revisão humana"], "q28|lula|o4": [0, "Revisão humana"],
  "q29|lula|o1": [1, "Revisão humana"], "q29|lula|o2": [0, "Revisão humana"], "q29|lula|o3": [0, "Revisão humana"], "q29|lula|o4": [0, "Revisão humana"],
  "q28|flavio-bolsonaro|o1": [0, "Revisão humana"], "q28|flavio-bolsonaro|o2": [0, "Revisão humana"], "q28|flavio-bolsonaro|o3": [1, "Revisão humana"], "q28|flavio-bolsonaro|o4": [0.5, "Revisão humana"],
  "q29|flavio-bolsonaro|o1": [0, "Revisão humana"], "q29|flavio-bolsonaro|o2": [0.5, "Revisão humana"], "q29|flavio-bolsonaro|o3": [0.5, "Revisão humana"], "q29|flavio-bolsonaro|o4": [0.5, "Revisão humana"],
};
