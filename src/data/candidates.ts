import type { Candidate } from "@/domain/types";

/**
 * Candidatos do segundo turno das eleições presidenciais de 2026.
 *
 * Apenas dados de identificação. Nenhuma posição política é registrada aqui.
 * CandidatePosition permanece vazio até ser preenchido por evidências
 * verificadas e aprovadas no fluxo de revisão.
 */
export const CANDIDATES: Candidate[] = [
  {
    id: "lula",
    slug: "lula",
    name: "Lula",
    roleContext:
      "Histórico avaliado com métricas de chefe do Executivo (políticas implementadas, leis propostas, sanções, vetos, decretos, orçamento, execução, programas e indicadores públicos), conforme os cargos executivos documentados em fontes oficiais.",
    historySourceIds: ["tse-planos-2026", "planalto-legislacao", "portal-transparencia", "camara-dados-abertos"],
  },
  {
    id: "flavio-bolsonaro",
    slug: "flavio-bolsonaro",
    name: "Flávio Bolsonaro",
    roleContext:
      "Histórico avaliado com métricas parlamentares (projetos, coautorias, relatorias, votos, emendas, comissões, fiscalização e pronunciamentos) no mandato de Senador da República (RJ, 2019–2027), conforme o perfil oficial do Senado Federal. Um parlamentar nunca é penalizado por não possuir competências executivas.",
    historySourceIds: ["tse-planos-2026", "senado-perfil-flavio-bolsonaro", "senado-dados-abertos", "camara-dados-abertos"],
  },
];

export const CANDIDATE_BY_ID: Record<string, Candidate> = Object.fromEntries(CANDIDATES.map((c) => [c.id, c]));
