import type { ContextNote } from "@/domain/types";

/**
 * Notas de contexto exibidas antes de determinadas perguntas.
 *
 * Regras:
 * - Notas LEGAL descrevem a legislação VIGENTE na data indicada em `asOf`,
 *   com fonte jurídica primária. Nunca descrevem propostas como se fossem lei.
 * - Notas CONCEPTUAL explicam termos. Não induzem resposta.
 * - Nenhuma nota atribui mérito ou responsabilidade a candidatos.
 */
export const CONTEXT_NOTES: ContextNote[] = [
  {
    id: "ctx-ir-2026",
    kind: "LEGAL",
    title: "Situação atual: Imposto de Renda em 2026",
    asOf: "2026-10-06",
    paragraphs: [
      "A partir de janeiro de 2026, rendimentos tributáveis mensais de até R$ 5.000 recebem uma redução que zera o Imposto de Renda devido. Acima desse valor existe redução parcial, decrescente, até a faixa definida pela legislação vigente.",
      "Essa regra não é uma proposta eleitoral: ela já possui base legal em vigor, estabelecida pela Lei nº 15.270, de 26 de novembro de 2025, e consta da tabela de 2026 publicada pela Receita Federal.",
      "A pergunta a seguir trata do princípio geral de quem ganha menos pagar menos imposto, não da aprovação da lei já vigente.",
    ],
    sourceIds: ["lei-15270-2025", "receita-ir-2026"],
    timeline: [
      { date: "2025-11-26", text: "Publicação da Lei nº 15.270/2025, que altera a legislação do Imposto de Renda das Pessoas Físicas.", sourceId: "lei-15270-2025" },
      { date: "2026-01-01", text: "Início da redução do imposto mensal para rendimentos tributáveis de até R$ 5.000, conforme a lei.", sourceId: "lei-15270-2025" },
      { date: "2026-01-01", text: "Receita Federal publica a tabela de tributação de 2026 com a nova redução.", sourceId: "receita-ir-2026" },
    ],
  },
  {
    id: "ctx-apostas-2026",
    kind: "LEGAL",
    title: "Situação atual: apostas de quota fixa em 2026",
    asOf: "2026-10-06",
    paragraphs: [
      "Em 25 de setembro de 2026 foi editada a Medida Provisória nº 1.394, que proíbe, no território nacional, a exploração, a oferta, a intermediação e a publicidade de loterias de apostas de quota fixa, e institui um comitê interinstitucional de fiscalização.",
      "Uma medida provisória tem força de lei desde a publicação, mas precisa ser apreciada pelo Congresso Nacional para ser convertida em lei definitiva. O status da tramitação deve ser consultado na fonte.",
      "O mercado de apostas, portanto, não está no mesmo regime de 2025. A pergunta a seguir trata de qual política você considera adequada, independentemente do regime atual.",
    ],
    sourceIds: ["mpv-1394-2026", "mf-spa-legislacao"],
    timeline: [
      { date: "2018-12-12", text: "Lei nº 13.756/2018 cria a modalidade lotérica de apostas de quota fixa.", sourceId: "lei-13756-2018" },
      { date: "2023-12-29", text: "Lei nº 14.790/2023 estabelece novo marco legal para a exploração das apostas de quota fixa.", sourceId: "lei-14790-2023" },
      { date: "2024-01-01", text: "Regulamentação administrativa pela Secretaria de Prêmios e Apostas do Ministério da Fazenda e início do mercado autorizado (2024 e 2025).", sourceId: "mf-spa-legislacao" },
      { date: "2026-09-25", text: "MP nº 1.394/2026 proíbe a exploração, oferta, intermediação e publicidade de apostas de quota fixa.", sourceId: "mpv-1394-2026" },
    ],
  },
  {
    id: "ctx-jornada",
    kind: "LEGAL",
    title: "Situação atual: jornada de trabalho",
    asOf: "2026-10-06",
    paragraphs: [
      "A Constituição Federal (art. 7º, XIII) fixa a duração normal do trabalho em até 8 horas diárias e 44 horas semanais, admitindo compensação e redução por acordo ou convenção coletiva.",
      "A expressão \"escala 6x1\" descreve o regime em que a pessoa trabalha seis dias e descansa um. O efeito prático de alterá-la é mudar o número máximo de dias ou horas trabalhadas por semana.",
      "Alterar o limite constitucional exige emenda à Constituição. Uma lei ordinária pode fixar limites menores que o teto constitucional. Propostas em tramitação não estão em vigor até sua aprovação e publicação.",
    ],
    sourceIds: ["constituicao-federal"],
  },
  {
    id: "ctx-pf-federativa",
    kind: "LEGAL",
    title: "Como a segurança pública se divide entre União e estados",
    asOf: "2026-10-06",
    paragraphs: [
      "Pela Constituição (art. 144), a segurança pública é exercida por órgãos federais e estaduais. A Polícia Federal, órgão da União, apura infrações contra a ordem política e social ou contra bens, serviços e interesses da União, infrações com repercussão interestadual ou internacional que exijam repressão uniforme (na forma da lei), tráfico de entorpecentes e contrabando, entre outras atribuições.",
      "As polícias civis e militares são subordinadas aos governadores dos estados. Uma maior participação federal pode ocorrer por instrumentos diferentes: cooperação federativa, integração de inteligência, lei ordinária ou alteração constitucional. Ao apresentar candidatos, este site indica qual instrumento cada candidatura defende.",
      "Para facilitar: seria algo parecido com a ideia de o FBI atuar nos Estados Unidos quando um crime ultrapassa o nível local ou estadual, embora a Polícia Federal brasileira tenha funções e regras diferentes.",
    ],
    sourceIds: ["constituicao-federal", "policia-federal"],
  },
  {
    id: "ctx-organizacoes-multilaterais",
    kind: "CONCEPTUAL",
    title: "ONU, Mercosul e BRICS não são instituições equivalentes",
    asOf: "2026-10-06",
    paragraphs: [
      "ONU: organização internacional de alcance universal, criada em 1945 por tratado, com estrutura permanente (Assembleia Geral, Conselho de Segurança, agências especializadas). O Brasil é membro fundador.",
      "Mercosul: bloco regional de integração econômica criado pelo Tratado de Assunção (1991) entre Brasil, Argentina, Paraguai e Uruguai, com tarifa externa comum e instituições próprias.",
      "BRICS: agrupamento de cooperação política e econômica entre países emergentes, sem tratado constitutivo nem secretariado permanente, que funciona por cúpulas anuais e iniciativas como o Novo Banco de Desenvolvimento.",
      "A pergunta a seguir trata das três organizações em conjunto. No relatório, as posições dos candidatos sobre cada uma são apresentadas separadamente.",
    ],
    sourceIds: ["mre"],
  },
  {
    id: "ctx-autonomia-tecnologica",
    kind: "CONCEPTUAL",
    title: "O que significa autonomia tecnológica",
    asOf: "2026-10-06",
    paragraphs: [
      "Autonomia tecnológica não significa produzir toda tecnologia dentro do país. O conceito se refere à capacidade de um país manter domínio, acesso ou alternativas próprias em tecnologias consideradas estratégicas.",
      "Autonomia, independência, resiliência, protecionismo, segurança nacional e competitividade são conceitos relacionados, mas diferentes. As perguntas a seguir tratam de escolhas concretas de política pública.",
    ],
    sourceIds: [],
  },
  {
    id: "ctx-nuvem-dados",
    kind: "CONCEPTUAL",
    title: "Termos usados nesta pergunta",
    asOf: "2026-10-06",
    paragraphs: [
      "Jurisdição de dados: a qual ordenamento jurídico os dados estão sujeitos. Residência de dados: onde os dados ficam fisicamente armazenados. Controle operacional: quem administra e tem acesso técnico aos sistemas. Criptografia: proteção que pode limitar o acesso ao conteúdo mesmo por quem hospeda. Dependência de fornecedores: dificuldade de migrar para outra solução.",
      "A localização física do servidor não equivale, por si só, a soberania tecnológica completa. Esses elementos podem ser combinados de formas diferentes.",
    ],
    sourceIds: [],
  },
  {
    id: "ctx-cadeias-suprimento",
    kind: "CONCEPTUAL",
    title: "Exemplos apenas como contexto",
    asOf: "2026-10-06",
    paragraphs: [
      "Itens frequentemente citados no debate público sobre capacidade nacional mínima incluem medicamentos, fertilizantes, semicondutores, energia, equipamentos de telecomunicações, equipamentos médicos e tecnologias de defesa. Os exemplos servem para ilustrar o tipo de item em discussão e não indicam qual resposta é adequada.",
    ],
    sourceIds: [],
  },
];
