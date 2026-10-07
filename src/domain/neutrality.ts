/**
 * Regras de neutralidade verificáveis em código.
 *
 * Estas frases nunca podem aparecer em texto gerado para o usuário nem em
 * resumos de evidência. A lista é usada por validação de publicação e por
 * testes que varrem o código-fonte.
 */
export const FORBIDDEN_PHRASES: readonly string[] = [
  "candidato recomendado",
  "melhor candidato",
  "seu candidato",
  "você deveria votar",
  "voce deveria votar",
  "compatibilidade total",
  "por cento lula",
  "por cento flávio",
  "por cento flavio",
  "% lula",
  "% flávio",
  "% flavio",
  "dos brasileiros apoiam",
  "dos brasileiros concordam",
  "intenção de voto",
  "intencao de voto",
  "candidato vencedor",
  "vote em",
];

export function findForbiddenPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_PHRASES.filter((p) => lower.includes(p));
}

/** Frase obrigatória no painel de estatísticas. */
export const STATISTICS_DISCLAIMER =
  "Esses dados refletem exclusivamente as pessoas que voluntariamente responderam a esta pesquisa. Não representam necessariamente o eleitorado brasileiro e não devem ser tratados como pesquisa eleitoral.";

/** Frase final do relatório. */
/** Fechamento da seção "Compare as propostas". */
export const COMPARISON_CLOSING_MESSAGE =
  "Este site não escolhe um candidato por você. As informações acima servem para ajudar você a entender suas próprias prioridades e comparar propostas e registros públicos. A decisão é sua.";

/** Mensagem final do relatório. */
export const FINAL_MESSAGE =
  "Você viu o que cada candidato propõe, parte de sua trajetória pública e os documentos utilizados para produzir este resumo. Os links acima permitem conferir as informações diretamente nas fontes originais. Este site não decide seu voto. A decisão é sua.";

/** Princípio central. */
export const CORE_PRINCIPLE = "Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação.";
