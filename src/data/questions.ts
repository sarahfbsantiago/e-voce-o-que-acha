import type { Question, QuestionOption } from "@/domain/types";

// ---------------------------------------------------------------------------
// Construtor de alternativas
// ---------------------------------------------------------------------------

const NAO_SEI = "Não sei";

/**
 * Cada alternativa: [rótulo, valor normalizado | null].
 * O valor normalizado (2 … −2) serve SOMENTE para organizar as respostas e
 * gráficos do próprio usuário. Nunca é somado contra posições de candidatos.
 * A alternativa "Não sei" é adicionada automaticamente ao final.
 */
type Opt = [label: string, value: number | null];

function options(qid: string, opts: Opt[]): QuestionOption[] {
  const all: Opt[] = [...opts, [NAO_SEI, 0]];
  return all.map(([label, value], i) => ({
    id: `${qid}-o${i + 1}`,
    label,
    order: i + 1,
    normalizedValue: value,
    isNoOpinion: label === NAO_SEI,
  }));
}

type Extra = Partial<Pick<Question, "subtopic" | "contextNoteIds" | "argumentsId" | "evidenceDistinctions" | "example">>;

function q(id: string, topicId: string, order: number, text: string, opts: Opt[], extra: Extra = {}): Question {
  return { id, topicId, order, text, kind: "SINGLE_CHOICE", options: options(id, opts), ...extra };
}

/**
 * Acrescenta uma alternativa nova sem mudar os ids das existentes (respostas já salvas continuam valendo).
 * A nova entra antes de `beforeId`; as ordens são renumeradas, "Não sei" continua por último.
 */
function withOption(question: Question, id: string, label: string, beforeId: string): Question {
  const list = [...question.options];
  const at = list.findIndex((o) => o.id === beforeId);
  list.splice(at, 0, { id, label, order: 0, normalizedValue: null, isNoOpinion: false });
  return { ...question, options: list.map((o, i) => ({ ...o, order: i + 1 })) };
}

// Escalas reutilizadas
const CONCORDA: Opt[] = [["Concordo", 2], ["Concordo em parte", 1], ["Discordo em parte", -1], ["Discordo", -2]];
const SIM_NAO = (meio: string): Opt[] => [["Sim", 2], [meio, 1], ["Não", -2]];

// ---------------------------------------------------------------------------
// Perguntas
// ---------------------------------------------------------------------------

export const QUESTIONS: Question[] = [
  // ---- Sessão 1. Economia e impostos --------------------------------------
  q("q01", "t01", 1, "Quem ganha muito dinheiro deveria pagar uma porcentagem maior de imposto (milionários e bilionários)?", CONCORDA),
  q("q03", "t01", 3, "Quando o governo precisa economizar dinheiro, o que deveria proteger primeiro?", [
    ["Saúde, educação e programas sociais", null],
    ["As contas públicas e a dívida", null],
    ["Tentar equilibrar os dois", null],
  ]),

  // ---- Sessão 2. Trabalho, emprego e jornada --------------------------------
  q("q05", "t02", 1, "Você é a favor de trabalhar 5 dias e folgar 2 por semana, sem redução do salário?", SIM_NAO("Depende da profissão"), {
    contextNoteIds: ["ctx-jornada"],
    evidenceDistinctions: ["proposta constitucional", "projeto legislativo", "apoio público", "posição em programa de governo", "medida efetivamente aprovada"],
  }),
  q("q08", "t02", 4, "O salário mínimo deveria aumentar acima da inflação quando a economia estiver crescendo?", SIM_NAO("Depende da situação econômica")),

  // ---- Sessão 3. Saúde -------------------------------------------------------
  q("q09", "t03", 1, "O SUS deveria continuar atendendo qualquer pessoa gratuitamente?", SIM_NAO("Sim, mas deveria privatizar uma parte")),
  q("q11", "t03", 3, "Na saúde, o que deveria ser prioridade?", [
    ["Fortalecer principalmente o SUS. Melhorar e expandir a sua atuação em todo território nacional", null],
    ["Fortalecer o SUS e também fazer parcerias com empresas privadas", null],
    ["Aumentar a participação de empresas privadas, apenas", null],
  ]),

  // ---- Sessão 4. Educação, ciência e pesquisa --------------------------------
  q("q13", "t04", 1, "O governo deveria investir mais em educação e pesquisas científicas?", SIM_NAO("Somente onde houver necessidade")),

  // ---- Sessão 5. Programas sociais, pobreza e desigualdade -------------------
  q("q17", "t05", 1, "O governo deveria manter programas que dão dinheiro para famílias de baixa renda?", [
    ["Sim", 2],
    ["Sim, mas com mais regras", 1],
    ["Deveriam ser reduzidos", -1],
    ["Não deveriam existir", -2],
  ]),
  withOption(q("q20", "t05", 4, "Para combater a pobreza, qual deveria ser a maior prioridade?", [
    ["Dar auxílio financeiro", null],
    ["Criar empregos", null],
    ["Aumentar salários", null],
    ["Investir em educação", null],
    ["Usar todas essas medidas", null],
  ]), "q20-o7", "Reduzir a inflação", "q20-o5"),

  // ---- Sessão 6. Segurança pública e crime organizado ------------------------
  q("q21", "t06", 1, "Quando crimes graves envolvem vários estados ao mesmo tempo, como grandes facções criminosas, tráfico de drogas e armas, lavagem de dinheiro e organizações que atuam em diferentes regiões do país, você acha que o governo federal e a Polícia Federal deveriam ter uma participação maior nas investigações?", CONCORDA, {
    example: "Por exemplo, se uma facção compra armas em um estado, envia drogas para outros estados e lava o dinheiro em empresas espalhadas pelo país, a Polícia Federal poderia reunir essas informações, investigar toda a rede e coordenar operações junto com as polícias estaduais, em vez de cada estado investigar apenas uma parte do crime.",
    contextNoteIds: ["ctx-pf-federativa"],
    evidenceDistinctions: ["competência constitucional da Polícia Federal", "competências das polícias estaduais", "cooperação federativa", "integração de inteligência", "investigações interestaduais", "política nacional de segurança", "propostas de alteração constitucional ou legislativa"],
  }),
  q("q23", "t06", 3, "O que ajuda mais a reduzir a violência?", [
    ["Mais polícia e punição", null],
    ["Mais prevenção, educação e oportunidades", null],
    ["As duas coisas juntas", null],
  ]),

  // ---- Sessão 7. Armas, drogas e apostas -------------------------------------
  q("q25", "t07", 1, "Comprar e ter armas deveria ser:", [
    ["Mais difícil", -2],
    ["Como é hoje", 0],
    ["Mais fácil", 2],
  ]),
  q("q27", "t07", 3, "Qual deveria ser a principal forma de lidar com drogas?", [
    ["Mais repressão policial", null],
    ["Mais tratamento de saúde", null],
    ["Mais prevenção e educação", null],
    ["Uma combinação dessas medidas", null],
  ]),
  q("q28", "t07", 4, "O que deveria acontecer com bets e apostas online?", [
    ["Deveriam ser proibidas", null],
    ["Deveriam existir com regras muito rígidas", null],
    ["Deveriam existir com regras semelhantes às de outros negócios", null],
    ["Deveriam ter poucas restrições", null],
  ], { contextNoteIds: ["ctx-apostas-2026"] }),

  // ---- Sessão 8. Meio ambiente e energia -------------------------------------
  q("q30", "t08", 1, "O governo deveria impedir obras ou negócios quando houver grande risco de destruir uma área ambiental importante?", SIM_NAO("Depende do tamanho do risco")),
  q("q31", "t08", 2, "Reduzir o desmatamento da Amazônia deveria ser uma prioridade do governo?", SIM_NAO("É importante, mas não deveria ser prioridade")),
  q("q32", "t08", 3, "O Brasil deveria ter metas para reduzir a poluição que contribui para mudanças no clima?", SIM_NAO("Sim, mas sem prejudicar demais a economia")),
  q("q33", "t08", 4, "Qual fonte de energia deveria receber mais investimentos?", [
    ["Solar e eólica", null],
    ["Petróleo e gás", null],
    ["Energia nuclear", null],
    ["Todas de forma equilibrada", null],
  ]),

  // ---- Sessão 9. Infraestrutura, indústria e desenvolvimento -----------------
  q("q36", "t09", 3, "O governo deveria investir mais em estradas, transporte público, saneamento e habitação?", SIM_NAO("Sim, mas sem aumentar muito os gastos")),

  // ---- Sessão 10. Tecnologia e autonomia do Brasil ---------------------------
  q("q38", "t10", 1, "O Brasil deveria depender menos de outros países?", [
    ["Sim", 2],
    ["Somente em algumas tecnologias", 1],
    ["Não é necessário", -2],
  ], { contextNoteIds: ["ctx-autonomia-tecnologica"], argumentsId: "arg-autonomia-tecnologica" }),

  // ---- Sessão 11. Relações internacionais ------------------------------------
  q("q43", "t11", 1, "O Brasil deveria manter boas relações com países mesmo quando discordar de seus governos?", SIM_NAO("Depende do país"), {
    argumentsId: "arg-orientacao-externa",
    evidenceDistinctions: ["Estados Unidos", "China", "União Europeia", "América Latina", "Mercosul", "BRICS"],
  }),
  q("q45", "t11", 3, "O Brasil deveria fortalecer sua participação em grupos como Mercosul, BRICS e ONU?", SIM_NAO("Em alguns deles"), {
    contextNoteIds: ["ctx-organizacoes-multilaterais"],
    argumentsId: "arg-multilaterais",
    evidenceDistinctions: ["ONU", "Mercosul", "BRICS"],
  }),

  // ---- Sessão 12. Direitos, democracia e instituições ------------------------
  q("q53", "t12", 3, "O modelo do STF ainda segue uma lógica de indicação. Você é a favor de uma reforma rígida do STF?", SIM_NAO("Sim, porém definir novas regras junto com a população")),
  q("q51", "t12", 4, "Órgãos como Polícia Federal, Ministério Público e tribunais de contas deveriam poder investigar pessoas do próprio governo sem interferência política?", SIM_NAO("Sim, mas com mais controle sobre essas instituições")),
  q("q52", "t12", 5, "Quando existem suspeitas de corrupção envolvendo políticos, qual deveria ser a regra?", [
    ["Investigar independentemente do partido", null],
    ["Investigar, mas com regras mais rígidas para evitar abusos", null],
    ["Somente investigar quando houver provas fortes desde o início", null],
  ]),
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export function questionsByTopic(topicId: string): Question[] {
  return QUESTIONS.filter((q) => q.topicId === topicId).sort((a, b) => a.order - b.order);
}
