import type { ResearchProtocol } from "@/domain/types";
import { QUESTIONS } from "./questions";
import { TOPIC_BY_ID } from "./topics";

/**
 * Protocolo público de seleção de evidências (contra cherry picking).
 *
 * Para cada questão, os termos de pesquisa, fontes, período e critérios são
 * definidos ANTES da pesquisa. O resultado da pesquisa não altera
 * retroativamente os critérios. Alterações geram nova versão da metodologia.
 */

export const COMMON_INCLUSION_CRITERIA = [
  "Documento diretamente relacionado ao assunto da questão.",
  "Autoria confirmada.",
  "Voto nominalmente registrado quando atribuído ao parlamentar.",
  "Declaração diretamente atribuível ao candidato.",
];

export const COMMON_EXCLUSION_CRITERIA = [
  "Opinião de terceiro.",
  "Postagem sem origem verificável.",
  "Imagem sem documento original.",
  "Vídeo cortado sem contexto suficiente.",
  "Texto atribuído ao candidato sem confirmação.",
  "Agregadores que não apontem para documento verificável.",
  "Posições de partido, familiares, aliados ou apoiadores (não são posições do candidato).",
];

export const COMMON_PERIOD = "Trajetória política documentada do candidato até a data de corte (2026-10-06).";

/** Fontes pesquisadas por padrão em todas as questões. */
const BASE_SOURCES = ["tse-planos-2026", "senado-atividade", "senado-dados-abertos", "camara-dados-abertos", "planalto-legislacao"];

/** Termos de pesquisa definidos previamente por questão. */
const SEARCH_TERMS: Record<string, string[]> = {
  q01: ["imposto de renda", "progressividade", "alta renda", "alíquota", "tributação", "super-ricos"],
  q02: ["isenção imposto de renda", "cinco mil", "R$ 5.000", "tabela do IR", "Lei 15.270", "baixa renda"],
  q03: ["arcabouço fiscal", "meta fiscal", "resultado primário", "gasto social", "dívida pública", "corte de gastos"],
  q04: ["política industrial", "crédito", "BNDES", "incentivo fiscal", "setores estratégicos", "Nova Indústria Brasil"],
  q05: ["jornada de trabalho", "redução da jornada", "44 horas", "sem redução de salário", "PEC"],
  q06: ["escala 6x1", "seis por um", "descanso semanal", "jornada", "PEC"],
  q07: ["trabalhadores de aplicativo", "motoristas de aplicativo", "entregadores", "plataformas digitais", "previdência"],
  q08: ["salário mínimo", "valorização do salário mínimo", "aumento real", "política de valorização"],
  q09: ["SUS", "universalidade", "saúde pública", "gratuidade"],
  q10: ["investimento em saúde", "orçamento da saúde", "piso da saúde", "financiamento do SUS"],
  q11: ["parceria público-privada saúde", "planos de saúde", "SUS", "setor privado saúde"],
  q12: ["complexo industrial da saúde", "produção nacional de vacinas", "medicamentos", "Fiocruz", "Butantan", "equipamentos médicos"],
  q13: ["universidades federais", "institutos federais", "expansão", "ensino superior", "rede federal"],
  q14: ["ProUni", "FIES", "bolsas", "financiamento estudantil", "instituições privadas"],
  q15: ["investimento em ciência", "CT&I", "FNDCT", "orçamento da ciência", "pesquisa e desenvolvimento"],
  q16: ["educação infantil", "ensino fundamental", "ensino médio", "ensino técnico", "ensino superior", "prioridade educação"],
  q17: ["transferência de renda", "Bolsa Família", "renda básica", "programa social", "benefício"],
  q18: ["condicionalidades", "Bolsa Família", "frequência escolar", "vacinação", "acompanhamento de saúde"],
  q19: ["tributação de super-ricos", "imposto sobre grandes fortunas", "financiamento de programas sociais", "progressividade"],
  q20: ["combate à pobreza", "geração de emprego", "salário", "educação", "auxílio"],
  q21: ["PEC da segurança pública", "coordenação federal", "Polícia Federal", "facções", "crime organizado", "interestadual"],
  q22: ["orçamento da Polícia Federal", "efetivo", "concurso PF", "recursos", "combate ao crime organizado", "corrupção"],
  q23: ["política de segurança", "prevenção", "repressão", "policiamento", "criminalidade"],
  q24: ["aumento de pena", "crimes violentos", "Código Penal", "endurecimento penal"],
  q25: ["arma", "armamento", "porte", "posse", "munição", "Sistema Nacional de Armas", "Estatuto do Desarmamento"],
  q26: ["CAC", "colecionador", "atirador", "caçador", "arma", "munição"],
  q27: ["política de drogas", "Lei de Drogas", "descriminalização", "redução de danos", "tratamento", "repressão ao tráfico"],
  q28: ["apostas", "bets", "quota fixa", "jogos online", "MP 1.394", "Lei 14.790", "regulação de apostas"],
  q29: ["publicidade de apostas", "propaganda bets", "patrocínio", "proteção ao consumidor"],
  q30: ["licenciamento ambiental", "área sensível", "unidade de conservação", "mineração", "dano ambiental"],
  q31: ["desmatamento", "Amazônia", "PPCDAm", "desmatamento zero", "INPE"],
  q32: ["emissões", "gases de efeito estufa", "NDC", "Acordo de Paris", "meta climática"],
  q33: ["energia solar", "energia eólica", "petróleo", "gás natural", "energia nuclear", "matriz energética", "transição energética"],
  q34: ["política industrial", "Nova Indústria Brasil", "incentivo fiscal", "compras governamentais", "financiamento", "BNDES"],
  q35: ["cadeia de suprimento", "produção nacional", "itens essenciais", "medicamentos", "fertilizantes", "dependência externa"],
  q36: ["infraestrutura", "PAC", "transporte público", "saneamento", "habitação", "Minha Casa Minha Vida", "rodovias"],
  q37: ["compras públicas", "margem de preferência", "produto nacional", "licitação", "Lei 14.133"],
  q38: ["dependência tecnológica", "soberania digital", "autonomia estratégica", "tecnologia estratégica", "investimento público"],
  q39: ["inteligência artificial", "modelo de IA", "IA brasileira", "PBIA", "plano brasileiro de IA"],
  q40: ["dados sensíveis", "LGPD", "dados estratégicos", "nuvem", "soberania de dados", "jurisdição"],
  q41: ["semicondutores", "chips", "satélite", "programa espacial", "telecomunicações", "infraestrutura digital", "conectividade"],
  q42: ["fornecedor único", "sistemas críticos", "dependência", "big tech", "contratação de TI"],
  q43: ["política externa", "relações diplomáticas", "pragmatismo", "governos autoritários", "diálogo"],
  q44: ["neutralidade", "Estados Unidos", "China", "disputa", "potências", "posição do Brasil"],
  q45: ["ONU", "Mercosul", "BRICS", "multilateralismo", "organizações internacionais"],
  q46: ["acordo comercial", "abertura comercial", "tarifa de importação", "indústria nacional", "Mercosul-União Europeia"],
  q47: ["autonomia", "soberania", "grandes potências", "não alinhamento", "divergência diplomática"],
  q48: ["casamento igualitário", "união homoafetiva", "casais do mesmo sexo", "direitos civis", "LGBT"],
  q49: ["Estado laico", "religião", "liberdade religiosa", "políticas públicas", "valores cristãos"],
  q50: ["STF", "decisão judicial", "cumprimento", "Supremo", "Poderes"],
  q51: ["Polícia Federal", "Ministério Público", "TCU", "CGU", "independência", "investigação", "autonomia"],
  q52: ["corrupção", "investigação", "abuso de autoridade", "Lava Jato", "garantias", "partido"],
};

/** Fontes adicionais específicas por questão (além das BASE_SOURCES). */
const EXTRA_SOURCES: Record<string, string[]> = {
  q02: ["lei-15270-2025", "receita-ir-2026"],
  q04: ["bndes", "finep", "mcti"],
  q05: ["constituicao-federal"],
  q06: ["constituicao-federal"],
  q12: ["datasus", "mcti"],
  q15: ["mcti", "cnpq", "capes", "finep"],
  q21: ["constituicao-federal", "policia-federal"],
  q22: ["policia-federal", "portal-transparencia"],
  q28: ["mpv-1394-2026", "lei-14790-2023", "lei-13756-2018", "mf-spa", "mf-spa-legislacao"],
  q29: ["mpv-1394-2026", "mf-spa-legislacao"],
  q31: ["inpe"],
  q33: ["bcb", "ibge"],
  q34: ["bndes", "finep", "mcti"],
  q35: ["mcti", "bndes"],
  q36: ["portal-transparencia"],
  q37: ["mcti"],
  q38: ["mcti", "finep", "bndes"],
  q39: ["mcti"],
  q40: ["anpd", "cgi-br"],
  q41: ["mcti", "aeb", "inpe", "anatel"],
  q42: ["cgi-br", "cert-br"],
  q43: ["mre"], q44: ["mre"], q45: ["mre"], q46: ["mre"], q47: ["mre"],
  q51: ["policia-federal"],
};

export const RESEARCH_PROTOCOLS: ResearchProtocol[] = QUESTIONS.map((q) => ({
  id: `rp-${q.id}`,
  questionId: q.id,
  topic: TOPIC_BY_ID[q.topicId].name,
  subtopic: q.subtopic ?? "—",
  searchTerms: SEARCH_TERMS[q.id] ?? [],
  sourceIds: [...BASE_SOURCES, ...(EXTRA_SOURCES[q.id] ?? [])],
  period: COMMON_PERIOD,
  inclusionCriteria: COMMON_INCLUSION_CRITERIA,
  exclusionCriteria: COMMON_EXCLUSION_CRITERIA,
  definedAt: "2026-10-06",
}));

export const RESEARCH_PROTOCOL_BY_QUESTION: Record<string, ResearchProtocol> = Object.fromEntries(
  RESEARCH_PROTOCOLS.map((p) => [p.questionId, p]),
);
