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

type Extra = Partial<Pick<Question, "subtopic" | "contextNoteIds" | "argumentsId" | "evidenceDistinctions">>;

function q(id: string, topicId: string, order: number, text: string, opts: Opt[], extra: Extra = {}): Question {
  return { id, topicId, order, text, kind: "SINGLE_CHOICE", options: options(id, opts), ...extra };
}

// Escalas reutilizadas
const CONCORDA: Opt[] = [["Concordo", 2], ["Concordo em parte", 1], ["Discordo em parte", -1], ["Discordo", -2]];
const SIM_NAO = (meio: string): Opt[] => [["Sim", 2], [meio, 1], ["Não", -2]];

// ---------------------------------------------------------------------------
// Perguntas
// ---------------------------------------------------------------------------

export const QUESTIONS: Question[] = [
  // ---- Sessão 1. Economia e impostos --------------------------------------
  q("q01", "t01", 1, "Quem ganha muito dinheiro deveria pagar uma porcentagem maior de imposto?", CONCORDA),
  q("q02", "t01", 2, "Pessoas que ganham menos deveriam pagar menos Imposto de Renda?", SIM_NAO("Sim, mas só para quem ganha pouco"), {
    contextNoteIds: ["ctx-ir-2026"],
  }),
  q("q03", "t01", 3, "Quando o governo precisa economizar dinheiro, o que deveria proteger primeiro?", [
    ["Saúde, educação e programas sociais", null],
    ["As contas públicas e a dívida", null],
    ["Tentar equilibrar os dois", null],
  ]),
  q("q04", "t01", 4, "O governo deveria ajudar empresas brasileiras consideradas importantes para o país?", [
    ["Sim, com investimentos e crédito", 2],
    ["Sim, mas só em alguns setores", 1],
    ["Não, empresas deveriam competir sem ajuda", -2],
  ], { argumentsId: "arg-politica-industrial", evidenceDistinctions: ["crédito", "subsídio", "incentivo fiscal", "compras públicas", "investimento estatal", "parceria privada"] }),

  // ---- Sessão 2. Trabalho, emprego e jornada --------------------------------
  q("q05", "t02", 1, "Você é a favor de trabalhar 5 dias e folgar 2 por semana, sem redução do salário?", SIM_NAO("Depende da profissão"), {
    contextNoteIds: ["ctx-jornada"],
    evidenceDistinctions: ["proposta constitucional", "projeto legislativo", "apoio público", "posição em programa de governo", "medida efetivamente aprovada"],
  }),
  q("q06", "t02", 2, "A escala em que a pessoa trabalha seis dias e folga um deveria continuar existindo?", [
    ["Não deveria continuar", -2],
    ["Deveria existir apenas em alguns trabalhos", 0],
    ["Deveria continuar como hoje", 2],
  ], { evidenceDistinctions: ["proposta constitucional", "projeto legislativo", "apoio público", "posição em programa de governo", "medida efetivamente aprovada"] }),
  q("q07", "t02", 3, "Motoristas e entregadores de aplicativos deveriam ter direitos como aposentadoria, férias ou proteção em caso de acidente?", SIM_NAO("Alguns direitos")),
  q("q08", "t02", 4, "O salário mínimo deveria aumentar acima da inflação quando a economia estiver crescendo?", SIM_NAO("Depende da situação econômica")),

  // ---- Sessão 3. Saúde -------------------------------------------------------
  q("q09", "t03", 1, "O SUS deveria continuar atendendo qualquer pessoa gratuitamente?", SIM_NAO("Sim, mas deveria mudar algumas regras")),
  q("q10", "t03", 2, "O governo deveria gastar mais dinheiro com saúde pública?", SIM_NAO("Sim, mas apenas se reduzir gastos em outras áreas")),
  q("q11", "t03", 3, "Na saúde, o que deveria ser prioridade?", [
    ["Fortalecer principalmente o SUS", null],
    ["Fortalecer o SUS e fazer parcerias com empresas", null],
    ["Aumentar a participação de empresas privadas", null],
  ]),
  q("q12", "t03", 4, "O Brasil deveria produzir mais remédios, vacinas e equipamentos de saúde dentro do próprio país?", [
    ["Sim", 2],
    ["Apenas os produtos mais importantes", 1],
    ["Não, importar pode ser melhor", -2],
  ], { argumentsId: "arg-capacidade-nacional" }),

  // ---- Sessão 4. Educação, ciência e pesquisa --------------------------------
  q("q13", "t04", 1, "O governo deveria criar mais universidades e institutos federais?", SIM_NAO("Somente onde houver necessidade")),
  q("q14", "t04", 2, "O governo deveria ajudar estudantes de baixa renda a pagar faculdade particular?", SIM_NAO("Sim, mas com regras mais rígidas")),
  q("q15", "t04", 3, "O Brasil deveria investir mais dinheiro em pesquisas científicas?", SIM_NAO("Somente em pesquisas que tragam resultados mais rápidos"), { argumentsId: "arg-ciencia" }),
  q("q16", "t04", 4, "Qual área deveria receber mais dinheiro primeiro?", [
    ["Educação infantil e ensino fundamental", null],
    ["Ensino médio", null],
    ["Ensino técnico", null],
    ["Universidades", null],
    ["Todas são igualmente importantes", null],
  ]),

  // ---- Sessão 5. Programas sociais, pobreza e desigualdade -------------------
  q("q17", "t05", 1, "O governo deveria manter programas que dão dinheiro para famílias de baixa renda?", [
    ["Sim", 2],
    ["Sim, mas com mais regras", 1],
    ["Deveriam ser reduzidos", -1],
    ["Não deveriam existir", -2],
  ]),
  q("q18", "t05", 2, "Para receber alguns benefícios, famílias deveriam manter as crianças na escola e fazer acompanhamento de saúde?", SIM_NAO("Depende do benefício")),
  q("q19", "t05", 3, "O governo deveria cobrar mais impostos de pessoas muito ricas?", SIM_NAO("Em alguns casos")),
  q("q20", "t05", 4, "Para combater a pobreza, qual deveria ser a maior prioridade?", [
    ["Dar auxílio financeiro", null],
    ["Criar empregos", null],
    ["Aumentar salários", null],
    ["Investir em educação", null],
    ["Usar todas essas medidas", null],
  ]),

  // ---- Sessão 6. Segurança pública e crime organizado ------------------------
  q("q21", "t06", 1, "Em crimes graves que envolvem vários estados, como grandes facções, tráfico de drogas, armas e lavagem de dinheiro, o governo federal e a Polícia Federal deveriam atuar mais, ajudando e coordenando as polícias estaduais?", CONCORDA, {
    contextNoteIds: ["ctx-pf-federativa"],
    evidenceDistinctions: ["competência constitucional da Polícia Federal", "competências das polícias estaduais", "cooperação federativa", "integração de inteligência", "investigações interestaduais", "política nacional de segurança", "propostas de alteração constitucional ou legislativa"],
  }),
  q("q22", "t06", 2, "A Polícia Federal deveria ter mais recursos para combater facções, corrupção, tráfico e crimes que acontecem em vários estados?", SIM_NAO("Sim, mas apenas em crimes mais graves"), {
    evidenceDistinctions: ["orçamento", "efetivo", "competência legal", "cooperação com estados"],
  }),
  q("q23", "t06", 3, "O que ajuda mais a reduzir a violência?", [
    ["Mais polícia e punição", null],
    ["Mais prevenção, educação e oportunidades", null],
    ["As duas coisas juntas", null],
  ]),
  q("q24", "t06", 4, "Crimes violentos deveriam ter penas maiores?", SIM_NAO("Depende do crime")),

  // ---- Sessão 7. Armas, drogas e apostas -------------------------------------
  q("q25", "t07", 1, "Comprar e ter armas deveria ser:", [
    ["Mais difícil", -2],
    ["Como é hoje", 0],
    ["Mais fácil", 2],
  ]),
  q("q26", "t07", 2, "Pessoas registradas como colecionadores, atiradores e caçadores deveriam ter regras diferentes para comprar armas?", SIM_NAO("Somente em alguns casos")),
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
  q("q29", "t07", 5, "Propagandas de bets deveriam ser permitidas?", [
    ["Não", null],
    ["Sim, mas com regras muito rígidas", null],
    ["Sim, com avisos e limites", null],
    ["Sim, sem grandes restrições", null],
  ]),

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
  q("q34", "t09", 1, "O governo deveria ajudar a indústria brasileira a crescer?", [
    ["Sim, bastante", 2],
    ["Sim, em setores importantes", 1],
    ["Não, empresas deveriam competir sem ajuda", -2],
  ], { argumentsId: "arg-politica-industrial" }),
  q("q35", "t09", 2, "O Brasil deveria produzir dentro do país alguns produtos importantes?", SIM_NAO("Somente produtos essenciais"), {
    contextNoteIds: ["ctx-cadeias-suprimento"],
    argumentsId: "arg-capacidade-nacional",
  }),
  q("q36", "t09", 3, "O governo deveria investir mais em estradas, transporte público, saneamento e habitação?", SIM_NAO("Sim, mas sem aumentar muito os gastos")),
  q("q37", "t09", 4, "Quando preço e qualidade forem parecidos, o governo deveria dar preferência a produtos feitos no Brasil?", SIM_NAO("Somente em áreas importantes"), { argumentsId: "arg-compras-publicas" }),

  // ---- Sessão 10. Tecnologia e autonomia do Brasil ---------------------------
  q("q38", "t10", 1, "O Brasil deveria depender menos de outros países para tecnologias importantes?", [
    ["Sim", 2],
    ["Somente em algumas tecnologias", 1],
    ["Não é necessário", -2],
  ], { contextNoteIds: ["ctx-autonomia-tecnologica"], argumentsId: "arg-autonomia-tecnologica" }),
  q("q39", "t10", 2, "O governo deveria investir no desenvolvimento de inteligência artificial brasileira?", [
    ["Sim", 2],
    ["Somente em universidades e pesquisa", 1],
    ["Deveria deixar principalmente para empresas privadas", -1],
    ["Não deveria investir", -2],
  ], { argumentsId: "arg-ia", evidenceDistinctions: ["uso de IA pelo governo", "desenvolvimento de modelos", "infraestrutura computacional", "regulação", "pesquisa científica", "formação profissional", "política industrial"] }),
  q("q40", "t10", 3, "Informações importantes do governo e dos cidadãos deveriam ter regras especiais para ficarem protegidas no Brasil?", [
    ["Sim", 2],
    ["Somente informações muito sensíveis", 1],
    ["Não é necessário", -2],
  ], { contextNoteIds: ["ctx-nuvem-dados"], argumentsId: "arg-dados" }),
  q("q41", "t10", 4, "O Brasil deveria investir em chips, satélites, internet e outras tecnologias próprias, mesmo que isso custe mais no começo?", SIM_NAO("Somente nas áreas mais importantes"), {
    argumentsId: "arg-tecnologias-proprias",
    evidenceDistinctions: ["semicondutores (pesquisa, design, encapsulamento, fabricação)", "satélites e espaço", "telecomunicações", "infraestrutura digital"],
  }),
  q("q42", "t10", 5, "Sistemas importantes do governo deveriam evitar depender de uma única empresa estrangeira?", [
    ["Sim", 2],
    ["Somente sistemas muito importantes", 1],
    ["Não é necessário", -2],
  ], { argumentsId: "arg-fornecedor-unico" }),

  // ---- Sessão 11. Relações internacionais ------------------------------------
  q("q43", "t11", 1, "O Brasil deveria manter boas relações com países mesmo quando discordar de seus governos?", SIM_NAO("Depende do país"), {
    argumentsId: "arg-orientacao-externa",
    evidenceDistinctions: ["Estados Unidos", "China", "União Europeia", "América Latina", "Mercosul", "BRICS"],
  }),
  q("q44", "t11", 2, "Quando Estados Unidos, China ou outras grandes potências entram em disputa, o Brasil deveria:", [
    ["Tomar sua própria decisão em cada caso", null],
    ["Ficar mais próximo dos Estados Unidos e da Europa", null],
    ["Ficar mais próximo da China e de países emergentes", null],
    ["Evitar tomar lado sempre que possível", null],
  ], { argumentsId: "arg-disputas" }),
  q("q45", "t11", 3, "O Brasil deveria fortalecer sua participação em grupos como Mercosul, BRICS e ONU?", SIM_NAO("Em alguns deles"), {
    contextNoteIds: ["ctx-organizacoes-multilaterais"],
    argumentsId: "arg-multilaterais",
    evidenceDistinctions: ["ONU", "Mercosul", "BRICS"],
  }),
  q("q46", "t11", 4, "Ao fazer acordos com outros países, o Brasil deveria priorizar:", [
    ["Comprar e vender com mais liberdade", null],
    ["Proteger empresas e empregos brasileiros", null],
    ["Equilibrar as duas coisas", null],
  ], { argumentsId: "arg-comercio" }),
  q("q47", "t11", 5, "O Brasil deveria buscar mais independência nas decisões internacionais, mesmo quando isso desagradar países mais poderosos?", SIM_NAO("Depende da situação"), { argumentsId: "arg-autonomia-externa" }),

  // ---- Sessão 12. Direitos, democracia e instituições ------------------------
  q("q48", "t12", 1, "Casais do mesmo sexo deveriam ter os mesmos direitos dos outros casais?", SIM_NAO("Alguns direitos")),
  q("q49", "t12", 2, "Religiões deveriam influenciar as decisões do governo?", [
    ["Não", -2],
    ["Podem participar do debate, mas não decidir políticas", 0],
    ["Sim, deveriam ter mais influência", 2],
  ]),
  q("q50", "t12", 3, "Quando o STF toma uma decisão válida, governo e Congresso devem cumprir essa decisão mesmo discordando dela?", SIM_NAO("Depende do caso")),
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
