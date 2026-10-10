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

/** Princípio central. */
export const CORE_PRINCIPLE = "Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação.";
