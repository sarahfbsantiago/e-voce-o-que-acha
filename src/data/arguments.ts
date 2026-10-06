import type { ArgumentSet } from "@/domain/types";

/**
 * "Entenda os argumentos": possíveis argumentos utilizados no debate público,
 * a favor e contra determinada política.
 *
 * São ARGUMENTOS, não fatos estabelecidos. O site não informa qual argumento é
 * melhor. Nenhum argumento é atribuído a candidato.
 */
export const ARGUMENT_SETS: ArgumentSet[] = [
  {
    id: "arg-politica-industrial",
    policy: "Apoio do governo a empresas e setores considerados importantes",
    inFavor: ["Compras públicas e crédito podem criar demanda inicial para novos setores.", "Incentivos podem compensar falhas de mercado em inovação.", "Outros países utilizam instrumentos semelhantes."],
    against: ["Risco de captura por grupos de interesse.", "Custo fiscal e dificuldade de encerrar incentivos ineficazes.", "Governo pode errar ao escolher setores vencedores."],
  },
  {
    id: "arg-capacidade-nacional",
    policy: "Produzir no país itens considerados essenciais mesmo quando importar é mais barato",
    inFavor: ["Reduz risco de desabastecimento em crises globais.", "Mantém conhecimento técnico no país.", "Permite resposta rápida a emergências, como as de saúde."],
    against: ["Produzir internamente pode custar significativamente mais.", "Definir o que é essencial é contestável e sujeito a pressões.", "Estoques e acordos de fornecimento podem ser alternativas mais baratas."],
  },
  {
    id: "arg-ciencia",
    policy: "Aumentar investimento público em pesquisa científica",
    inFavor: ["Pesquisa é base de inovação e de formação de pessoas qualificadas.", "Setor privado tende a investir pouco em pesquisa de longo prazo.", "Países com maior investimento tendem a ter maior produtividade."],
    against: ["Recursos concorrem com saúde, educação básica e outras prioridades.", "Resultados demoram e são incertos.", "Eficiência do gasto depende de governança e avaliação."],
  },
  {
    id: "arg-compras-publicas",
    policy: "Preferência a produtos brasileiros em compras públicas",
    inFavor: ["Fortalece empresas e empregos locais.", "Facilita suporte, auditoria e adaptação a requisitos nacionais.", "Pode reduzir dependência externa."],
    against: ["Risco de pagar mais por qualidade equivalente ou inferior.", "Critérios de equivalência são difíceis de verificar objetivamente.", "Pode ser questionado como protecionismo em acordos internacionais."],
  },
  {
    id: "arg-autonomia-tecnologica",
    policy: "Depender menos de outros países em tecnologias importantes",
    inFavor: ["Reduz exposição a restrições de exportação ou sanções de outros países.", "Desenvolve capacidade científica e industrial local.", "Cria alternativas em caso de falha de fornecedores externos."],
    against: ["Alto custo e longo prazo de retorno.", "Risco de escolher tecnologias que se tornem obsoletas.", "Importar pode ser mais eficiente quando há oferta competitiva global."],
  },
  {
    id: "arg-ia",
    policy: "Investimento público em inteligência artificial brasileira",
    inFavor: ["Modelos treinados com dados e língua locais podem atender melhor a necessidades nacionais.", "Reduz dependência de fornecedores estrangeiros em serviços públicos.", "Fortalece pesquisa e formação de profissionais."],
    against: ["Custo elevado de computação e de talentos.", "Modelos globais evoluem rapidamente e podem superar iniciativas locais.", "Governo pode não ser o agente mais eficiente para desenvolver modelos."],
  },
  {
    id: "arg-dados",
    policy: "Regras especiais para proteger dados do governo e dos cidadãos no Brasil",
    inFavor: ["Dados ficam sujeitos à lei brasileira e a fiscalização nacional.", "Reduz risco de acesso por governos estrangeiros.", "Facilita resposta a incidentes."],
    against: ["Localização física não impede todos os riscos de acesso.", "Pode encarecer e atrasar serviços públicos.", "Exigências rígidas podem ser contornadas por arranjos contratuais sem ganho real."],
  },
  {
    id: "arg-tecnologias-proprias",
    policy: "Investir em chips, satélites, internet e outras tecnologias próprias",
    inFavor: ["Redução de dependência externa em insumos críticos.", "Monitoramento ambiental, comunicações e conectividade dependem de infraestrutura própria.", "Desenvolvimento tecnológico e qualificação profissional."],
    against: ["Alto custo fiscal, especialmente na fabricação de chips e em lançamentos espaciais.", "Economias de escala internacionais dificultam competir.", "Serviços comerciais estrangeiros podem ser mais baratos e rápidos."],
  },
  {
    id: "arg-fornecedor-unico",
    policy: "Evitar dependência de uma única empresa estrangeira em sistemas importantes",
    inFavor: ["Reduz risco de interrupção por falha ou decisão de um único fornecedor.", "Aumenta poder de negociação do governo.", "Facilita migração e atualização tecnológica."],
    against: ["Diversificar aumenta complexidade e custos de integração.", "Pode impedir ganhos de escala com um fornecedor.", "Nem sempre há alternativas equivalentes disponíveis."],
  },
  {
    id: "arg-orientacao-externa",
    policy: "Manter boas relações com países mesmo discordando de seus governos",
    inFavor: ["Diversificar parceiros amplia mercados e reduz vulnerabilidade a decisões de um único país.", "Mantém canais de diálogo para resolver disputas.", "Permite ao Brasil atuar como mediador."],
    against: ["Pode gerar críticas por relações com governos autoritários.", "Pode reduzir a capacidade de defender valores democráticos.", "Parceiros com instituições semelhantes tendem a oferecer maior previsibilidade."],
  },
  {
    id: "arg-disputas",
    policy: "Postura em disputas entre grandes potências",
    inFavor: ["Neutralidade preserva relações com todos os lados e reduz riscos de retaliação.", "Avaliação caso a caso permite defender princípios sem compromissos automáticos.", "Alinhamento claro pode trazer benefícios de cooperação com o bloco escolhido."],
    against: ["Neutralidade pode ser vista como omissão em temas de direitos ou segurança.", "Avaliação caso a caso pode gerar percepção de imprevisibilidade.", "Alinhamento fixo reduz capacidade de negociação com o outro lado."],
  },
  {
    id: "arg-multilaterais",
    policy: "Fortalecer a participação em Mercosul, BRICS e ONU",
    inFavor: ["Regras compartilhadas protegem países de peso médio contra decisões unilaterais.", "Fóruns multilaterais ampliam a voz brasileira em temas globais.", "Integração regional pode gerar escala econômica."],
    against: ["Organizações multilaterais podem ser lentas e dependentes de consenso.", "Compromissos coletivos reduzem flexibilidade de decisão nacional.", "Heterogeneidade entre membros, especialmente no BRICS, limita a coordenação."],
  },
  {
    id: "arg-comercio",
    policy: "Prioridade em acordos comerciais",
    inFavor: ["Mais liberdade comercial tende a reduzir preços e estimular competitividade.", "Proteção pode preservar empregos e capacidades industriais.", "Equilibrar permite adaptação gradual de setores sensíveis."],
    against: ["Abertura rápida pode provocar fechamento de empresas e desemprego setorial.", "Proteção prolongada pode manter ineficiências e preços altos.", "Equilíbrio sem critérios claros pode gerar imprevisibilidade."],
  },
  {
    id: "arg-autonomia-externa",
    policy: "Mais independência nas decisões internacionais",
    inFavor: ["Maior liberdade para decidir conforme interesses próprios.", "Menor exposição a pressões externas em temas sensíveis.", "Possibilidade de atuar como mediador em disputas."],
    against: ["Divergências podem gerar custos comerciais, financeiros ou tecnológicos.", "Autonomia sem capacidade econômica proporcional pode ter efeito limitado.", "Pode dificultar acesso a cooperação e investimento de parceiros tradicionais."],
  },
];

export const ARGUMENT_SET_BY_ID: Record<string, ArgumentSet> = Object.fromEntries(
  ARGUMENT_SETS.map((a) => [a.id, a]),
);
