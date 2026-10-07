import type { AreaId } from "@/components/report/areaGroups";

/** Ato documentado de um candidato: o que ele FEZ (lei sancionada, decreto, medida provisória, programa lançado, projeto de autoria). */
export interface CandidateAct {
  title: string;
  year: string;
  kind: string;
  /** Área da pizza (classificação pela ementa/objeto do ato). */
  area: AreaId;
  url: string;
}

/**
 * Atos por candidato, usados na pizza "Atuação por área" do relatório.
 * - Lula: SELEÇÃO de leis, decretos, medidas provisórias e programas de grande alcance conferidos nas fontes oficiais
 *   (Planalto, gov.br) em 06/10/2026. Não é o total: nos mandatos dele o Poder Executivo apresentou 1.303 proposições
 *   na Câmara (455 PL, 34 PLP, 18 PEC, 660 MPV, 136 PLN), ver LULA_EXECUTIVE_PROPOSALS.
 * - Flávio Bolsonaro: todas as 66 proposições de sua autoria principal nos Dados Abertos do Senado (06/10/2026),
 *   classificadas por área pela ementa. Projeto de autoria não equivale a lei aprovada.
 */
/** Totais oficiais (Câmara, arquivos anuais de proposições e autores; autor do tipo Poder Executivo; 2003–2010 e 2023–06/10/2026). */
export const LULA_EXECUTIVE_PROPOSALS = { pl: 455, plp: 34, pec: 18, mpv: 660, pln: 136, total: 1303, asOf: "2026-10-06", sourceId: "camara-arquivos-proposicoes-executivo" } as const;

/** Totais de Flávio Bolsonaro como autor principal no Senado (Dados Abertos, 06/10/2026). */
export const FLAVIO_SENATE_PROPOSALS = { pl: 53, total: 66, asOf: "2026-10-06", sourceId: "senado-dados-abertos-flavio-bolsonaro" } as const;

export const CANDIDATE_ACTS: Record<string, CandidateAct[]> = {
  lula: [
    {
        "title": "Fome Zero (Lei nº 10.689/2003)",
        "year": "2003",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.689.htm"
    },
    {
        "title": "História e cultura afro-brasileira nas escolas (Lei nº 10.639/2003)",
        "year": "2003",
        "kind": "Lei sancionada",
        "area": "instituicoes",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.639.htm"
    },
    {
        "title": "Luz para Todos (Decreto nº 4.873/2003)",
        "year": "2003",
        "kind": "Decreto",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/decreto/2003/d4873.htm"
    },
    {
        "title": "Bolsa Família (Lei nº 10.836/2004)",
        "year": "2004",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.836.htm"
    },
    {
        "title": "Farmácia Popular (Lei nº 10.858/2004)",
        "year": "2004",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.858.htm"
    },
    {
        "title": "Brasil Sorridente (política nacional de saúde bucal)",
        "year": "2004",
        "kind": "Programa federal",
        "area": "social",
        "url": "https://www.gov.br/saude/pt-br/composicao/saps/brasil-sorridente"
    },
    {
        "title": "ProUni (Lei nº 11.096/2005)",
        "year": "2005",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11096.htm"
    },
    {
        "title": "Lei Maria da Penha (Lei nº 11.340/2006)",
        "year": "2006",
        "kind": "Lei sancionada",
        "area": "instituicoes",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm"
    },
    {
        "title": "PAC (Decreto nº 6.025/2007)",
        "year": "2007",
        "kind": "Decreto",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6025.htm"
    },
    {
        "title": "Reuni, expansão das universidades federais (Decreto nº 6.096/2007)",
        "year": "2007",
        "kind": "Decreto",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6096.htm"
    },
    {
        "title": "Institutos Federais (Lei nº 11.892/2008)",
        "year": "2008",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11892.htm"
    },
    {
        "title": "Minha Casa, Minha Vida (Lei nº 11.977/2009)",
        "year": "2009",
        "kind": "Lei sancionada",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l11977.htm"
    },
    {
        "title": "Novo Bolsa Família (Lei nº 14.601/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14601.htm"
    },
    {
        "title": "Igualdade salarial entre mulheres e homens (Lei nº 14.611/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "instituicoes",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14611.htm"
    },
    {
        "title": "Mais Médicos (Lei nº 14.621/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14621.htm"
    },
    {
        "title": "Escola em Tempo Integral (Lei nº 14.640/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14640.htm"
    },
    {
        "title": "Valorização do salário mínimo (Lei nº 14.663/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm"
    },
    {
        "title": "Novo PAC",
        "year": "2023",
        "kind": "Programa federal",
        "area": "economia",
        "url": "https://www.gov.br/casacivil/pt-br/novopac"
    },
    {
        "title": "Brasil Sem Fome",
        "year": "2023",
        "kind": "Programa federal",
        "area": "social",
        "url": "https://www.gov.br/mds/pt-br/acoes-e-programas/brasil-sem-fome"
    },
    {
        "title": "Desenrola Brasil (Lei nº 14.690/2023)",
        "year": "2023",
        "kind": "Lei sancionada",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14690.htm"
    },
    {
        "title": "Pé-de-Meia (Lei nº 14.818/2024)",
        "year": "2024",
        "kind": "Lei sancionada",
        "area": "social",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14818.htm"
    },
    {
        "title": "Isenção do IR até R$ 5 mil (Lei nº 15.270/2025)",
        "year": "2025",
        "kind": "Lei sancionada",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm"
    },
    {
        "title": "Lei Antifacção (Lei nº 15.358/2026)",
        "year": "2026",
        "kind": "Lei sancionada",
        "area": "seguranca",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15358.htm"
    },
    {
        "title": "Brasil Contra o Crime Organizado (programa, maio de 2026)",
        "year": "2026",
        "kind": "Programa federal",
        "area": "seguranca",
        "url": "https://dadosabertos.tse.jus.br/dataset/candidatos-2026"
    },
    {
        "title": "Desenrola Brasil 3.0 (MP nº 1.393/2026)",
        "year": "2026",
        "kind": "Medida provisória",
        "area": "economia",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/mpv/mpv1393.htm"
    },
    {
        "title": "Proibição das apostas de quota fixa (MP nº 1.394/2026)",
        "year": "2026",
        "kind": "Medida provisória",
        "area": "seguranca",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/mpv/mpv1394.htm"
    },
    {"title": "Fundo Amazônia: governança restabelecida (Decreto nº 11.368/2023)", "year": "2023", "kind": "Decreto", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11368.htm"},
    {"title": "Fundo Nacional do Meio Ambiente (Decreto nº 11.372/2023)", "year": "2023", "kind": "Decreto", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11372.htm"},
    {"title": "Infrações e sanções ambientais, fiscalização do Ibama (Decreto nº 11.373/2023)", "year": "2023", "kind": "Decreto", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11373.htm"},
    {"title": "Política Nacional de Educação Digital (Lei nº 14.533/2023)", "year": "2023", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14533.htm"},
    {"title": "Regras para armas, inclusive CACs (Decreto nº 11.615/2023)", "year": "2023", "kind": "Decreto", "area": "seguranca", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11615.htm"},
    {"title": "Programa Mover, mobilidade verde (Lei nº 14.902/2024)", "year": "2024", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14902.htm"},
    {"title": "Marco do hidrogênio de baixa emissão (Lei nº 14.948/2024)", "year": "2024", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14948.htm"},
    {"title": "Combustível do Futuro (Lei nº 14.993/2024)", "year": "2024", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14993.htm"},
    {"title": "Mercado regulado de carbono, SBCE (Lei nº 15.042/2024)", "year": "2024", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15042.htm"},
    {"title": "Energia eólica offshore (Lei nº 15.097/2025)", "year": "2025", "kind": "Lei sancionada", "area": "ambiente-tec", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15097.htm"},
    {"title": "Aliança Global contra a Fome e a Pobreza, lançada na Cúpula do G20 (2024)", "year": "2024", "kind": "Ato internacional", "area": "instituicoes", "url": "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/discursos-e-pronunciamentos/2024/11/discurso-do-presidente-lula-no-lancamento-da-alianca-global-contra-a-fome-e-a-pobreza"},
    {"title": "Presidência brasileira do BRICS e Cúpula do Rio (2025)", "year": "2025", "kind": "Ato internacional", "area": "instituicoes", "url": "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/discursos-e-pronunciamentos/2025/02/discurso-do-presidente-lula-na-abertura-da-primeira-reuniao-de-sherpas-da-presidencia-brasileira-do-brics"},
    {"title": "Discurso de abertura da 80ª Assembleia Geral da ONU (2025)", "year": "2025", "kind": "Discurso oficial", "area": "instituicoes", "url": "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/discursos-e-pronunciamentos/2025/09/discurso-do-presidente-lula-na-abertura-do-debate-geral-da-80a-assembleia-geral-das-nacoes-unidas"},
    {"title": "COP30 em Belém: abertura e presidência da conferência (2025)", "year": "2025", "kind": "Ato internacional", "area": "ambiente-tec", "url": "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/discursos-e-pronunciamentos/2025/11/discurso-do-presidente-lula-na-abertura-da-cop30-em-belem-pa"},
    {"title": "Acordo Mercosul–União Europeia sancionado (2026)", "year": "2026", "kind": "Decreto", "area": "instituicoes", "url": "https://www.gov.br/sri/pt-br/lula-sanciona-acordo-ue-mercosul-1"},
    {"title": "Novo PAC (Decreto nº 11.632/2023)", "year": "2023", "kind": "Decreto", "area": "economia", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11632.htm"},
    {"title": "Minha Casa, Minha Vida retomado (Lei nº 14.620/2023)", "year": "2023", "kind": "Lei sancionada", "area": "economia", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14620.htm"},
    {"title": "Plano Brasil Sem Fome (Decreto nº 11.679/2023)", "year": "2023", "kind": "Decreto", "area": "social", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11679.htm"},
    {"title": "Política Nacional de Cuidados (Lei nº 15.069/2024)", "year": "2024", "kind": "Lei sancionada", "area": "social", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15069.htm"},
    {"title": "Brasil Contra o Crime Organizado (Decreto nº 12.966/2026)", "year": "2026", "kind": "Decreto", "area": "seguranca", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12966.htm"},
    {"title": "Plano Brasileiro de Inteligência Artificial (2024)", "year": "2024", "kind": "Programa federal", "area": "ambiente-tec", "url": "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/plano-brasileiro-de-inteligencia-artificial"},
    {"title": "Pacto Nacional de Prevenção aos Feminicídios (2023)", "year": "2023", "kind": "Programa federal", "area": "instituicoes", "url": "https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/pacto-nacional-de-prevencao-aos-feminicidios"},
    {"title": "Agora Tem Especialistas (2025)", "year": "2025", "kind": "Programa federal", "area": "social", "url": "https://www.gov.br/ans/pt-br/assuntos/gestaosaude/agora-tem-especialistas"},
],
  "flavio-bolsonaro": [
    {
        "title": "PEC 32/2019 — Altera a redação do art. 228 da Constituição Federal, a fim de reduzir a maioridade penal para dezesseis anos.",
        "year": "2019",
        "kind": "PEC (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/135977"
    },
    {
        "title": "PEC 80/2019 — Altera os artigos 182 e 186 da Constituição Federal para dispor sobre a função social da propriedade urbana e…",
        "year": "2019",
        "kind": "PEC (autor principal)",
        "area": "instituicoes",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136894"
    },
    {
        "title": "PL 1451/2019 — Altera o Decreto nº 24.602, de 06 de julho de 1934, que “Dispõem sobre instalação e fiscalização de fábricas e…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/135687"
    },
    {
        "title": "PL 1715/2019 — Revoga o § 2º do art. 342 do Código Penal para suprimir a possibilidade de extinção de punibilidade pela retra…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/135938"
    },
    {
        "title": "PL 1867/2019 — Acrescenta o art. 320-B à Lei nº 9.503, de 23 de setembro de 1997, para limitar a remuneração de empresas pres…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136027"
    },
    {
        "title": "PL 2167/2019 — Altera os incisos III e VI do art. 21 da Lei nº 9.503, de 1997, que “Institui o Código de Trânsito Brasileiro”…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136253"
    },
    {
        "title": "PL 2169/2019 — Modifica a Lei nº 8.069, de 13 de julho de 1990, que dispõe sobre o Estatuto da Criança e do Adolescente, alte…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136254"
    },
    {
        "title": "PL 2170/2019 — Altera a Lei nº 9.394, de 20 de dezembro de 1996, que estabelece as diretrizes e bases da educação nacional, p…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136251"
    },
    {
        "title": "PL 2171/2019 — Altera o Código Penal para definir o crime de arrastão.",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136252"
    },
    {
        "title": "PL 2175/2019 — Altera o Código Penal para prever agravamento de pena em razão do emprego de brinquedos, réplicas e simulacros…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136262"
    },
    {
        "title": "PL 2362/2019 — Revoga o Capítulo IV - Da Reserva Legal, da Lei nº 12.651, de 25 de maio de 2012, que dispõe  sobre a proteção…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "ambiente-tec",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136371"
    },
    {
        "title": "PL 2393/2019 — Altera o Código Penal para dispor sobre a legítima defesa da sociedade pelo agente de segurança pública.",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136390"
    },
    {
        "title": "PL 3071/2019 — Altera a Lei 13.756 de 2018 para incluir a Associação Brasileira Beneficente de Reabilitação -ABBR no destino…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136918"
    },
    {
        "title": "PL 3132/2019 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para revogar a atenuante da menoridade…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136970"
    },
    {
        "title": "PL 3133/2019 — Altera o art. 64 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 – Código Penal, para prever que o condenado…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136978"
    },
    {
        "title": "PL 3462/2019 — Altera o Decreto Lei nº 2.848, de 07 de dezembro de 1940 (Código Penal) para incluir como causa de aumento de…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/137241"
    },
    {
        "title": "PL 3589/2019 — Altera a Lei nº 5.991, de 17 de dezembro de 1973, que dispõe sobre o controle sanitário do comércio de drogas,…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/137330"
    },
    {
        "title": "PL 4640/2019 — Acrescenta o art. 25-A ao Decreto-Lei nº 2.848, de 7 de dezembro de 1940 – Código Penal, para prever a exclude…",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/138227"
    },
    {
        "title": "PL 6479/2019 — Institui a região da Costa Verde, nos termos que especifica, como Área Especial de Interesse Turístico.",
        "year": "2019",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/140268"
    },
    {
        "title": "PLP 132/2019 — Altera a Lei Complementar nº 159, de 19 de maio de 2017, que institui o Regime de Recuperação Fiscal dos Estad…",
        "year": "2019",
        "kind": "PLP (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/136764"
    },
    {
        "title": "PLP 214/2019 — Altera o art. 61-A da Lei Complementar n° 123, de 14 de dezembro de 2006, para regular a remuneração do invest…",
        "year": "2019",
        "kind": "PLP (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/138702"
    },
    {
        "title": "PL 1174/2020 — Dispõe sobre a realização de Assembleias Gerais de Acionistas e Reuniões de Sócios com possibilidade de votaçã…",
        "year": "2020",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/141305"
    },
    {
        "title": "PL 3324/2020 — Altera a Lei nº 10.406, de 10 de janeiro de 2002 para autorizar a emissão de debêntures por sociedades limitad…",
        "year": "2020",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/142510"
    },
    {
        "title": "PL 2326/2021 — Altera a Lei nº 8.078, de 11 de setembro de 1990, para estabelecer parâmetros na oferta de produtos e serviços…",
        "year": "2021",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/148902"
    },
    {
        "title": "PL 2327/2021 — Altera a Lei nº 12.305, de 2 de agosto de 2010, para tratar da logística reversa para baterias de veículos elé…",
        "year": "2021",
        "kind": "PL (autor principal)",
        "area": "ambiente-tec",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/148903"
    },
    {
        "title": "PL 2734/2021 — Altera a Lei nº 8.906, de 4 de julho de 1994, e a Lei nº 10.826, de 22 de dezembro de 2003, para conceder port…",
        "year": "2021",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/149286"
    },
    {
        "title": "PL 4475/2021 — Altera o art. 329 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para estabelecer tipos pen…",
        "year": "2021",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/151329"
    },
    {
        "title": "PL 4476/2021 — Altera o art. 218-A do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para tipificar a conduta…",
        "year": "2021",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/151330"
    },
    {
        "title": "PLP 157/2021 — Autoriza o Poder Executivo a criar a Região Administrativa Integrada de Desenvolvimento Sustentável da Costa V…",
        "year": "2021",
        "kind": "PLP (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/150245"
    },
    {
        "title": "PL 828/2022 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 – Código Penal, para aumentar as penas previstas para…",
        "year": "2022",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/152626"
    },
    {
        "title": "PL 829/2022 — Altera o art. 129 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), e o art. 1º da Lei nº 8.07…",
        "year": "2022",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/152627"
    },
    {
        "title": "PL 830/2022 — Altera a Lei nº 8.069, de 13 de julho de 1990 - Estatuto da Criança e do Adolescente, para aumentar as penas d…",
        "year": "2022",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/152628"
    },
    {
        "title": "PL 969/2022 — Altera a Lei nº 13.019, de 31 de julho de 2014, para incluir o esporte dentre as atividades previstas como pre…",
        "year": "2022",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/152773"
    },
    {
        "title": "PDL 107/2023 — Susta os efeitos do Decreto nº 11.466, de 5 de abril 2023, que trata da metodologia para comprovação da capaci…",
        "year": "2023",
        "kind": "PDL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/156769"
    },
    {
        "title": "PDL 193/2023 — Susta os efeitos do Decreto nº 11.615, de 21 de julho de 2023, que regulamenta a Lei nº 10.826, de 22 de dezem…",
        "year": "2023",
        "kind": "PDL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/158826"
    },
    {
        "title": "PL 2109/2023 — Altera o Código Penal para prever que o ato preparatório no crime de massa é punível em caso de crime que impl…",
        "year": "2023",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/157069"
    },
    {
        "title": "PL 3165/2023 — Altera a Lei nº 9.503, de 23 de setembro de 1997 (Código de Trânsito Brasileiro), para modificar as regras sob…",
        "year": "2023",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/158333"
    },
    {
        "title": "PL 5335/2023 — Altera a Lei 10.257, de 10 de julho de 200, para incluir normas sobre concessão de uso especial para fins de m…",
        "year": "2023",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/160817"
    },
    {
        "title": "PL 6043/2023 — Altera a Lei 9.472, de 16 de julho de 1997, para tornar obrigatório o bloqueio do código IMEI (Identificação I…",
        "year": "2023",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/161629"
    },
    {
        "title": "PL 6131/2023 — Altera os arts. 155 e 157 do Decreto-Lei nº 2.848, de 07 de dezembro de 1940 (Código Penal), para dispor sobre…",
        "year": "2023",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/161721"
    },
    {
        "title": "PRS 19/2023 — Estabelece que as concessões de garantia pela União, direta ou indiretamente, em operações de crédito à export…",
        "year": "2023",
        "kind": "PRS (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/155978"
    },
    {
        "title": "PEC 53/2024 — Dá nova redação à alínea “d” do inciso XXXVIII do art. 5º da Constituição Federal para excetuar da competência…",
        "year": "2024",
        "kind": "PEC (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/166887"
    },
    {
        "title": "PL 517/2024 — Altera a Lei nº 14.597, de 14 de junho de 2023, que institui a Lei Geral do Esporte, para estabelecer medidas…",
        "year": "2024",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/162279"
    },
    {
        "title": "PL 4082/2024 — Veda a concessão de liberdade provisória e aplicação de medidas cautelares diversas à prisão para presos em fl…",
        "year": "2024",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/165920"
    },
    {
        "title": "PDL 29/2025 — Susta o Decreto nº 12.341, de 23 de dezembro de 2024.",
        "year": "2025",
        "kind": "PDL (autor principal)",
        "area": "instituicoes",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/167042"
    },
    {
        "title": "PDL 96/2025 — Susta os efeitos a Portaria MAPA/SDA Nº 1179, de 05 setembro de 2024 e a Portaria SDA/MAPA Nº 1.244, de 18 de…",
        "year": "2025",
        "kind": "PDL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/167313"
    },
    {
        "title": "PDL 1165/2025 — Susta o Decreto nº 12.774, de 09 de dezembro de 2025.",
        "year": "2025",
        "kind": "PDL (autor principal)",
        "area": "instituicoes",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/172022"
    },
    {
        "title": "PL 494/2025 — Altera o art. 155 do Decreto-Lei nº 2.848, de 07 de dezembro de 1940 (Código Penal) para dispor sobre o crime…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/167238"
    },
    {
        "title": "PL 1950/2025 — Dispõe da devolução dos descontos não autorizados em folha de pagamento dos benefícios previdenciários relativ…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/168298"
    },
    {
        "title": "PL 3300/2025 — Altera a Lei 8.078, de 11 de setembro de 1990 (Código de Defesa do Consumidor), para estabelecer o direito à t…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/169490"
    },
    {
        "title": "PL 3846/2025 — Dispõe sobre a isenção de cobrança de taxas de pouso, decolagem ou uso de infraestrutura rodoviária por aerona…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "economia",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/169779"
    },
    {
        "title": "PL 3980/2025 — Dispõe sobre a obrigatoriedade de cobertura integral e prioritária, no âmbito do Sistema Único de Saúde (SUS),…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/169904"
    },
    {
        "title": "PL 4244/2025 — Altera a Lei 2.848, de 7 de setembro de 1940 (Código Penal), para incluir como circunstância agravante, a prát…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/170061"
    },
    {
        "title": "PL 4597/2025 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para incluir como qualificadora do cri…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/170485"
    },
    {
        "title": "PL 4598/2025 — Altera o Decreto Lei 2.848, de 7 de dezembro de 1940 (Código Penal), para incluir como circunstância agravante…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/170486"
    },
    {
        "title": "PL 4963/2025 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para acrescentar parágrafos ao art. 27…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/170769"
    },
    {
        "title": "PL 5115/2025 — Altera as Lei nº 8.742, de 7 de dezembro de 1993, e nº 10.741, de 1º de outubro de 2003, para determinar a ins…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/170925"
    },
    {
        "title": "PL 5593/2025 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para incluir expressamente o advogado…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/171423"
    },
    {
        "title": "PL 5594/2025 — Altera o Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para agravar as penas do crime de aten…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/171424"
    },
    {
        "title": "PL 5646/2025 — Altera a Lei nº 7.565, de 19 de dezembro de 1986 (Código Brasileiro de Aeronáutica), para dispor sobre a inter…",
        "year": "2025",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/171453"
    },
    {
        "title": "PEC 4/2026 — Altera a Constituição Federal para determinar a inelegibilidade para o cargo de Presidente da República no per…",
        "year": "2026",
        "kind": "PEC (autor principal)",
        "area": "instituicoes",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/172830"
    },
    {
        "title": "PL 1019/2026 — Institui a Política Nacional de Unidades de Pronto Atendimento à Mulher - UPAM, destinadas ao atendimento huma…",
        "year": "2026",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/172949"
    },
    {
        "title": "PL 1400/2026 — Altera a Lei nº 11.340, de 7 de agosto de 2006, para autorizar a autoridade policial a conceder, em caráter im…",
        "year": "2026",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/173320"
    },
    {
        "title": "PL 2809/2026 — Altera a Lei nº 10.741, de 1º de outubro de 2003 (Estatuto do Idoso), para dispor sobre o apoio de equipe mult…",
        "year": "2026",
        "kind": "PL (autor principal)",
        "area": "social",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/174418"
    },
    {
        "title": "PL 3211/2026 — Institui o Dia Nacional do Antissemitismo Jamais; estabelece diretrizes para a promoção de políticas de preven…",
        "year": "2026",
        "kind": "PL (autor principal)",
        "area": "instituicoes",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/174772"
    },
    {
        "title": "PL 5196/2026 — Altera os art. 61, 62 e 65 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), para estabelecer…",
        "year": "2026",
        "kind": "PL (autor principal)",
        "area": "seguranca",
        "url": "https://www25.senado.leg.br/web/atividade/materias/-/materia/175586"
    }
],
};
