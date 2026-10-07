import type { ViewPosition } from "./flavio-view-positions";

/**
 * Posições de Lula ajustadas pelo texto "Visão Lula" (src/data/candidate-views.ts),
 * escrito e revisado pela responsável pelo projeto em 07/10/2026 (revisão humana).
 *
 * Só entram as perguntas em que o texto aponta para uma alternativa diferente da posição
 * já publicada. As demais posições de Lula já batiam com o texto e continuam com as evidências oficiais.
 */
export const LULA_VIEW_POSITIONS: (ViewPosition & { sourceId: string })[] = [
  { questionId: "q11", direction: "SUPPORTS", closestOptionId: "q11-o1", sourceId: "govbr-programas", basis: "Mais Médicos, Agora Tem Especialistas, Brasil Sorridente, Farmácia Popular e prontuário eletrônico único: ampliar e expandir o atendimento do SUS." },
  { questionId: "q16", direction: "SUPPORTS", closestOptionId: "q16-o5", sourceId: "govbr-programas", basis: "Alfabetização e Escola em Tempo Integral, Pé-de-Meia no ensino médio, Institutos Federais e expansão das universidades federais." },
  { questionId: "q25", direction: "OPPOSES", closestOptionId: "q25-o1", sourceId: "tse-proposta-governo-2026-lula", basis: "Maior controle de armas: em 2023 o governo estabeleceu novas regras para compra, posse, porte, registro e comercialização de armas e munições, inclusive para CACs." },
  { questionId: "q30", direction: "SUPPORTS", closestOptionId: "q30-o1", sourceId: "tse-proposta-governo-2026-lula", basis: "Fiscalização, queimadas e Ibama: recompôs as regras de infrações e sanções ambientais e amplia recursos para fiscalização contra garimpo ilegal e desmatamento." },
  { questionId: "q38", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q38-o2", sourceId: "tse-proposta-governo-2026-lula", basis: "Soberania digital e defesa cibernética: reduzir a dependência externa em áreas críticas." },
];
