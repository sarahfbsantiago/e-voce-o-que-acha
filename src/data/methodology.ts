import type { MethodologyVersion } from "@/domain/types";

export const CURRENT_METHODOLOGY_VERSION = "1.3.0";

/** Data da última atualização de dados políticos e legislativos. */
export const POLITICAL_DATA_UPDATED_AT = "2026-10-06";

/**
 * Histórico de versões. Nenhuma versão é apagada: alterações criam uma nova
 * entrada e fecham `effectiveUntil` da anterior.
 */
export const METHODOLOGY_VERSIONS: MethodologyVersion[] = [
  {
    id: "mv-1.0.0",
    version: "1.0.0",
    title: "Metodologia inicial",
    description:
      "Primeira versão. Definiu 13 temas, 68 perguntas em linguagem técnica, a escala interna de normalização (uso restrito a gráficos do próprio usuário), a hierarquia de evidências (níveis A–D), as quatro classificações de evidência, o protocolo de pesquisa por questão, o fluxo de revisão cega e o tratamento de ausência de evidência, mudanças de posição, estatísticas e causalidade.",
    effectiveFrom: "2026-10-06",
    effectiveUntil: "2026-10-06",
    createdAt: "2026-10-06",
    changeLog: [
      "Criação dos temas 1 a 11 (Economia e impostos; Trabalho e renda; Pobreza e proteção social; Saúde; Educação; Segurança pública; Armas; Meio ambiente; Direitos individuais; Democracia e instituições; Estado e administração pública).",
      "Criação do tema 12 (Apostas e jogos online) com contexto legal vigente: MP nº 1.394/2026.",
      "Atualização das questões tributárias para o cenário de 2026: a redução do IR para rendimentos até R$ 5.000 é tratada como legislação vigente (Lei nº 15.270/2025), não como proposta.",
      "Criação do tema 13 (Relações internacionais, soberania e tecnologia) com 31 perguntas e 18 subtemas.",
      "Nenhuma posição de candidato cadastrada.",
    ],
  },
  {
    id: "mv-1.1.0",
    version: "1.1.0",
    title: "Questionário em linguagem simples",
    description:
      "Substitui o conjunto de perguntas pela versão em linguagem simples: 12 sessões e 52 perguntas, com alternativas curtas e a opção 'Não sei' em todas. A escala de importância passa a ser 'Não importa / Importa pouco / Importa / Importa muito / É uma das coisas mais importantes para mim'. O relatório passa a mostrar, por tema: sua resposta, proposta de cada candidato, o que cada um já fez, o que é apenas proposta, o que já está em vigor, fonte, link e data. Regras de evidência, hierarquia, revisão cega, estatísticas e causalidade permanecem as da versão 1.0.0.",
    effectiveFrom: "2026-10-06",
    effectiveUntil: "2026-10-06",
    createdAt: "2026-10-06",
    changeLog: [
      "Sessões: Economia e impostos; Trabalho, emprego e jornada; Saúde; Educação, ciência e pesquisa; Programas sociais, pobreza e desigualdade; Segurança pública e crime organizado; Armas, drogas e apostas; Meio ambiente e energia; Infraestrutura, indústria e desenvolvimento; Tecnologia e autonomia do Brasil; Relações internacionais; Direitos, democracia e instituições.",
      "Perguntas removidas em relação à 1.0.0: aborto, tributação de dividendos, autonomia em defesa, software aberto, telecomunicações futuras, satélites (incorporado à pergunta 41), cibersegurança (parcialmente coberta pelas perguntas 40 e 42), fuga de talentos, modelo do Mercosul, tamanho do Estado.",
      "Perguntas novas: política de drogas; fontes de energia; infraestrutura (estradas, transporte, saneamento, habitação); produção nacional de insumos de saúde; regra para investigação de corrupção; prioridade no combate à pobreza.",
      "A pergunta 21 traz uma comparação explicativa com a atuação federal nos Estados Unidos, com a ressalva de que a Polícia Federal brasileira tem funções e regras diferentes.",
      "Evidências passam a registrar 'inForce' (em vigor / apenas proposta ou em tramitação / não se aplica) para separar o que é apenas proposta do que já está em vigor.",
      "Contextos legais mantidos: Imposto de Renda 2026 (Lei nº 15.270/2025), apostas (MP nº 1.394/2026), jornada de trabalho (Constituição, art. 7º, XIII), divisão federativa da segurança pública (art. 144).",
      "Nova seção 'Conheça melhor os candidatos': trajetória, cargos, experiência no Executivo e no Legislativo, categorias de atuação documentada, resumo do programa 2026 por tema com etiquetas (Manter, Ampliar, Criar, Mudar, Reduzir, Não há proposta clara), tabela de comparação de experiência e pontos centrais escolhidos por critérios objetivos. Cada item traz fontes e indica se já foi conferido.",
      "No mapa de prioridades, cada tema pode indicar a 'maior proximidade documentada' entre as respostas do usuário e as posições publicadas, com a contagem de perguntas. O cálculo é por tema, exige evidência publicada para os dois candidatos e nunca é somado em um resultado geral.",
      "Nenhuma posição de candidato cadastrada nesta versão.",
    ],
  },
  {
    id: "mv-1.2.0",
    version: "1.2.0",
    title: "Posições publicadas, comparação por pergunta e conta aberta",
    description:
      "Primeira versão com posições dos dois candidatos publicadas para as 52 perguntas, classificadas a partir do programa de governo de 2026 registrado no TSE e da atuação em fontes oficiais (leis, decretos e medidas provisórias no Planalto; projetos de autoria no Senado; proposições e votações na Câmara; páginas oficiais do gov.br), com revisão humana antes da publicação. O relatório passa a comparar cada resposta com a posição documentada (igual, parecida, diferente), a indicar por tema quem ficou mais perto, a contar os temas e a mostrar a proporção de concordância por candidato, sempre com a fórmula à vista. Silêncio do candidato conta como diferente, para os dois, e nunca vira posição atribuída.",
    effectiveFrom: "2026-10-06",
    effectiveUntil: "2026-10-07",
    createdAt: "2026-10-06",
    changeLog: [
      "104 posições publicadas (52 perguntas × 2 candidatos), cada uma com direção, alternativa mais próxima, resumo e evidências com trecho literal, data, link e classificação (proposta, posição, atuação).",
      "Regra do silêncio: pergunta respondida pela pessoa em que o candidato não tem posição documentada conta como 'diferente' para ele; o relatório mostra 'não se posicionou nas fontes oficiais' e a etiqueta 'conta como diferente'. O site não atribui posições.",
      "Proximidade por tema: score = (iguais + 0,5 × parecidas) ÷ perguntas respondidas no tema; empate não indica ninguém; só 'evidência insuficiente' quando nenhum candidato tem posição no tema.",
      "Bloco 'Qual candidato está mais próximo do seu perfil': contagem de temas e proporções de concordância por candidato, com a conta aberta. Sem peso por importância, sem nota, sem ranking.",
      "Explicação por pergunta cita primeiro o que foi feito (lei, decreto, projeto), depois o que foi prometido; mudanças de posição mostram linha do tempo (ex.: apostas, MP nº 1.394/2026).",
      "Declarações registradas pela imprensa profissional entram só como declaração, com a frase entre aspas, e não definem sozinhas a direção de uma posição.",
      "Tela de administração (/admin/posicoes) para publicar, rejeitar ou despublicar posições, com auditoria; reimportações preservam o que já foi revisado.",
      "Perfis dos candidatos: experiência profissional e cargos públicos com fonte (biografia do Planalto, Senado, registros do TSE), leis e projetos com link, quadro de principais realizações, propostas e posições por tema com página do programa.",
      "Questionário: alternativas exibidas da mais afirmativa para a mais negativa, 'Não sei' por último; avanço só pelo botão; sem notas de contexto ou argumentos durante as perguntas (ficam no relatório).",
      "Texto das perguntas 5 ('trabalhar 5 dias e folgar 2 por semana, sem redução do salário'), 19 ('cobrar mais impostos de pessoas muito ricas') e 35 ('produzir dentro do país alguns produtos importantes') ajustado.",
      "Relatório enxuto: pizza das áreas por importância, proximidade por tema com detalhe por pergunta, cobertura das respostas, trajetória dos candidatos e fontes; comparação pergunta a pergunta por candidato e resumos longos do programa saíram da interface pública.",
      "Consentimento para estatísticas anônimas vem pré-marcado como 'Sim', com 'Não' a um toque e explicação dos benefícios.",
      "Pizzas dos candidatos medem atos, não promessas: leis, decretos, medidas provisórias e programas conferidos (Lula) e proposições de autoria principal no Senado (Flávio Bolsonaro), classificados por área pelo objeto do ato. Os 12 temas aparecem agrupados em cinco áreas nas pizzas e no bloco de proximidade, sem efeito no cálculo.",
      "A explicação por pergunta no relatório cita o documento que sustenta a posição, com data e link para a fonte.",
      "O relatório pode ser baixado em PDF e o questionário pode ser reiniciado do zero.",
    ],
  },
  {
    id: "mv-1.3.0",
    version: "1.3.0",
    title: "Aceite obrigatório para participar",
    description:
      "A tela antes das perguntas passa a ter um único aceite, no modelo da LGPD: para participar, a pessoa concorda com a Política de Privacidade e com o uso anônimo, em nível de pesquisa, das respostas, do resultado do relatório (com qual candidato as respostas ficaram mais próximas), da nota dada à pesquisa e de se ela ajudou na decisão. Faixa etária e região continuam opcionais. A regra das versões anteriores, em que recusar a coleta não impedia o questionário, deixa de valer. Algoritmo, posições e perguntas não mudam.",
    effectiveFrom: "2026-10-07",
    effectiveUntil: null,
    createdAt: "2026-10-07",
    changeLog: [
      "Saem as opções 'Sim, contribuir anonimamente' e 'Não, responder sem enviar'. Entra uma caixa de aceite obrigatória, desmarcada por padrão, com link para a Política de Privacidade e a lista do que é compartilhado.",
      "A condição é informada com destaque ('Para participar, é preciso concordar'), como pede a LGPD (art. 9º, § 3º).",
      "A avaliação da pesquisa só é enviada por quem aceitou.",
      "Quem revogar o consentimento em Privacidade e dados precisa aceitar de novo para voltar a responder; envios anteriores são anônimos e não podem ser identificados.",
      "As pizzas de atuação dos candidatos saíram do relatório: comparavam uma seleção de 49 atos de Lula com todas as 66 proposições de Flávio Bolsonaro e davam a impressão errada de quantidade. O perfil de Lula passa a mostrar o total oficial de proposições do Poder Executivo nos mandatos dele (1.303 na Câmara, 455 projetos de lei), e o de Flávio, as 66 do Senado (53 projetos de lei).",
      "O site passa a se chamar Menos Pior. O lema 'Você decide. Nós organizamos as evidências.' continua.",
    ],
  },
];
