import type { Topic } from "@/domain/types";

/**
 * Temas (sessões) do questionário. A ordem aqui é apenas a ordem de
 * apresentação das perguntas. No relatório, a ordem é definida pela
 * importância declarada pelo próprio usuário.
 */
export const TOPICS: Topic[] = [
  { id: "t01", slug: "economia-e-impostos", order: 1, name: "Economia e impostos", description: "Impostos, contas públicas e apoio a empresas consideradas importantes.", priorityQuestion: "Quanto Economia e Impostos importam para você na escolha de um candidato?" },
  { id: "t02", slug: "trabalho-emprego-e-jornada", order: 2, name: "Trabalho, emprego e jornada", description: "Jornada semanal, escala 6x1, trabalhadores de aplicativos e salário mínimo.", priorityQuestion: "Quanto Trabalho e Jornada importam para você?" },
  { id: "t03", slug: "saude", order: 3, name: "Saúde", description: "SUS, gasto público em saúde, parcerias e produção nacional de insumos.", priorityQuestion: "Quanto Saúde importa para você?" },
  { id: "t04", slug: "educacao-ciencia-e-pesquisa", order: 4, name: "Educação, ciência e pesquisa", description: "Rede federal, apoio a estudantes, pesquisa científica e prioridade entre etapas.", priorityQuestion: "Quanto Educação, Ciência e Pesquisa importam para você?" },
  { id: "t05", slug: "programas-sociais-pobreza-e-desigualdade", order: 5, name: "Programas sociais, pobreza e desigualdade", description: "Transferência de renda, condicionalidades, financiamento e prioridades contra a pobreza.", priorityQuestion: "Quanto Programas Sociais e Combate à Pobreza importam para você?" },
  { id: "t06", slug: "seguranca-publica-e-crime-organizado", order: 6, name: "Segurança pública e crime organizado", description: "Papel federal em crimes interestaduais, recursos da Polícia Federal, prevenção, punição e penas.", priorityQuestion: "Quanto Segurança Pública importa para você?" },
  { id: "t07", slug: "armas-drogas-e-apostas", order: 7, name: "Armas, drogas e apostas", description: "Acesso a armas, regime de CACs, política de drogas e apostas online.", priorityQuestion: "Quanto Armas, Drogas e Apostas importam para você?" },
  { id: "t08", slug: "meio-ambiente-e-energia", order: 8, name: "Meio ambiente e energia", description: "Proteção de áreas sensíveis, desmatamento, metas climáticas e fontes de energia.", priorityQuestion: "Quanto Meio Ambiente e Energia importam para você?" },
  { id: "t09", slug: "infraestrutura-industria-e-desenvolvimento", order: 9, name: "Infraestrutura, indústria e desenvolvimento", description: "Apoio à indústria, produção nacional, obras e preferência a produtos brasileiros.", priorityQuestion: "Quanto Infraestrutura e Indústria importam para você?" },
  { id: "t10", slug: "tecnologia-e-autonomia-do-brasil", order: 10, name: "Tecnologia e autonomia do Brasil", description: "Dependência tecnológica, inteligência artificial, proteção de dados, tecnologias próprias e fornecedores.", priorityQuestion: "Quanto Tecnologia e Autonomia Nacional importam para você?" },
  { id: "t11", slug: "relacoes-internacionais", order: 11, name: "Relações internacionais", description: "Relações com outros governos, disputas entre potências, Mercosul, BRICS, ONU, acordos e independência.", priorityQuestion: "Quanto Relações Internacionais importam para você?" },
  { id: "t12", slug: "direitos-democracia-e-instituicoes", order: 12, name: "Direitos, democracia e instituições", description: "Direitos civis, religião e Estado, decisões do STF, independência dos órgãos de controle e corrupção.", priorityQuestion: "Quanto Direitos, Democracia e Instituições importam para você?" },
];

export const TOPIC_BY_ID: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
