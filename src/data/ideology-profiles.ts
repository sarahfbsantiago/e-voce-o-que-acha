/**
 * Descrição da ideologia da pessoa, no estilo "descrição de signo", mostrada abaixo de "Sua ideologia" no relatório.
 * Pedido da responsável em 09/10/2026 (texto aguarda revisão humana). Chave = nome da ideologia em IDEOLOGY_RANGES.
 */
export const IDEOLOGY_PROFILES: Record<string, { text: string; keywords: string[] }> = {
  Comunismo: {
    text: "Você sonha com um mundo sem patrões e sem divisão de classes, em que o que é produzido pertence a todos. Acredita que os problemas sociais nascem da forma como a economia está organizada e que só uma mudança profunda resolveria. Quer um futuro em que ninguém precise vender o próprio tempo só para sobreviver.",
    keywords: ["Igualdade radical", "Coletividade", "Transformação"],
  },
  Socialismo: {
    text: "Você acredita que a economia deve servir às pessoas, e não o contrário. Gosta de cooperativas, de trabalhadores com voz nas decisões e de setores estratégicos sob controle público. Quer um futuro com menos desigualdade e mais solidariedade.",
    keywords: ["Solidariedade", "Trabalho", "Controle democrático"],
  },
  "Social-democracia": {
    text: "Você aceita o mercado, mas não abre mão de uma rede de proteção forte: saúde pública, escola pública e direitos trabalhistas. Acha justo quem ganha mais contribuir mais. Quer um futuro em que o capitalismo funcione para todo mundo, com oportunidades de verdade.",
    keywords: ["Proteção social", "Justiça fiscal", "Equilíbrio"],
  },
  Progressismo: {
    text: "Você olha para a frente: acredita que leis e costumes precisam evoluir para incluir quem ficou de fora. Se incomoda com discriminação e defende direitos iguais para todas as pessoas. Quer um futuro mais diverso, mais inclusivo e com oportunidades para todos.",
    keywords: ["Direitos", "Inclusão", "Mudança"],
  },
  "Centro político": {
    text: "Você foge dos extremos e gosta de ouvir os dois lados antes de decidir. Prefere soluções práticas, negociadas e graduais a grandes rupturas. Quer um futuro estável, em que o país avance por acordos, e não por brigas.",
    keywords: ["Equilíbrio", "Diálogo", "Pragmatismo"],
  },
  "Liberalismo social": {
    text: "Você valoriza a liberdade de cada um escolher o próprio caminho, mas acha que o Estado tem um papel em garantir que todos comecem com chances reais. Defende um mercado com regras claras e as liberdades civis. Quer um futuro livre e cheio de oportunidades.",
    keywords: ["Liberdade", "Oportunidade", "Regras justas"],
  },
  "Liberalismo econômico e conservadorismo": {
    text: "Você acredita no trabalho, no esforço individual e na livre iniciativa, e desconfia de um Estado grande e caro. Valoriza a família, as tradições e a ordem, e prefere mudanças feitas com prudência. Quer um futuro próspero, seguro e com as contas em dia.",
    keywords: ["Livre iniciativa", "Tradição", "Ordem"],
  },
  "Nacionalismo radical": {
    text: "Você coloca o país e a identidade nacional acima de tudo. Desconfia de influências estrangeiras e de acordos internacionais, e quer proteger a cultura e a soberania brasileiras. Quer um futuro em que o Brasil decida sozinho o próprio rumo.",
    keywords: ["Soberania", "Identidade nacional", "Proteção"],
  },
  Fascismo: {
    text: "Você defende uma nação forte e unida acima das liberdades individuais, com autoridade concentrada e pouca tolerância à oposição. Quer um futuro de ordem imposta e de projeto nacional único.",
    keywords: ["Nação acima de tudo", "Autoridade", "Unidade"],
  },
};
