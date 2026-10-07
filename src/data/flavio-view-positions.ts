import type { PositionDirection } from "@/domain/types";

/**
 * Posições de Flávio Bolsonaro derivadas do texto "Visão Flávio" (src/data/candidate-views.ts),
 * escrito e revisado pela responsável pelo projeto em 07/10/2026 (revisão humana).
 *
 * Só entram as perguntas que o texto responde com clareza. As demais continuam com as posições
 * já publicadas. Perguntas de escala usam a direção; perguntas de alternativas usam a alternativa
 * mais próxima (closestOptionId), como no resto do site.
 */
export interface ViewPosition {
  questionId: string;
  direction: PositionDirection;
  closestOptionId?: string;
  /** Trecho do texto da responsável que justifica a posição. */
  basis: string;
}

export const FLAVIO_VIEW_SOURCE_IDS = [
  "folha-flavio-plano-governo-stf-2026",
  "folha-flavio-imposto-folha-2026",
  "uol-flavio-escala-6x1-2026",
];

export const FLAVIO_VIEW_POSITIONS: ViewPosition[] = [
  // Economia e impostos
  { questionId: "q03", direction: "SUPPORTS", closestOptionId: "q03-o2", basis: "Defende que o governo gaste menos dinheiro e reduza o tamanho do governo." },

  // Trabalho, emprego e jornada
  { questionId: "q05", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q05-o2", basis: "Empresas e trabalhadores devem ter mais liberdade para combinar salário, horário e jornada." },
  { questionId: "q06", direction: "SUPPORTS", closestOptionId: "q06-o3", basis: "Defende regras de trabalho mais flexíveis, com liberdade para combinar a jornada." },

  // Saúde
  { questionId: "q09", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q09-o2", basis: "Diz que pretende ajustar o SUS." },
  { questionId: "q11", direction: "SUPPORTS", closestOptionId: "q11-o2", basis: "Pretende ajustar o SUS e defende parceria com o setor privado." },

  // Educação, ciência e pesquisa
  { questionId: "q15", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q15-o2", basis: "Quer que pesquisas das universidades tenham mais ligação com empresas, tecnologia e produção." },
  { questionId: "q16", direction: "SUPPORTS", closestOptionId: "q16-o3", basis: "Educação mais focada em aprendizado, profissão e mercado de trabalho." },

  // Programas sociais
  { questionId: "q17", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q17-o2", basis: "O benefício deve ser uma ajuda até a pessoa conseguir emprego, com maior fiscalização." },
  { questionId: "q20", direction: "SUPPORTS", closestOptionId: "q20-o2", basis: "Os programas devem ajudar a pessoa a conseguir emprego e aumentar sua própria renda." },

  // Segurança pública
  { questionId: "q23", direction: "SUPPORTS", closestOptionId: "q23-o1", basis: "Defende leis duras, penas maiores, mais presídios e mais vigilância." },

  // Armas, drogas e apostas
  { questionId: "q25", direction: "SUPPORTS", closestOptionId: "q25-o3", basis: "Defende facilitar o acesso a armas para pessoas que querem se proteger." },
  { questionId: "q26", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q26-o2", basis: "Tende a defender regras mais favoráveis para quem possui armas legalmente." },
  { questionId: "q27", direction: "SUPPORTS", closestOptionId: "q27-o1", basis: "É contra a descriminalização; o porte de drogas deve continuar sendo crime." },
  { questionId: "q28", direction: "SUPPORTS", closestOptionId: "q28-o3", basis: "É contra proibir as apostas; elas podem continuar funcionando dentro de regras." },

  // Meio ambiente e energia
  { questionId: "q30", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q30-o2", basis: "Defende flexibilizar o licenciamento ambiental para facilitar projetos econômicos." },
  { questionId: "q32", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q32-o2", basis: "Tenta juntar proteção ambiental com exploração econômica." },
  { questionId: "q33", direction: "SUPPORTS", closestOptionId: "q33-o2", basis: "O Brasil deve continuar usando petróleo e outras fontes fósseis." },

  // Infraestrutura
  { questionId: "q36", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q36-o2", basis: "Defende investimentos em infraestrutura, mas feitos em grande parte por empresas privadas." },

  // Tecnologia
  { questionId: "q38", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q38-o2", basis: "Defende mais autonomia, porém sem deixar de importar do exterior." },

  // Relações internacionais
  { questionId: "q44", direction: "SUPPORTS", closestOptionId: "q44-o2", basis: "Defende aproximação maior com os Estados Unidos e Israel." },
  { questionId: "q45", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q45-o2", basis: "Critica algumas posições do Brasil dentro do Brics." },
  { questionId: "q46", direction: "SUPPORTS", closestOptionId: "q46-o1", basis: "Quer mais liberdade para o Brasil fazer acordos comerciais." },

  // Direitos, democracia e instituições
  { questionId: "q50", direction: "PARTIALLY_SUPPORTS", closestOptionId: "q50-o2", basis: "Quer diminuir a capacidade do STF de controlar outros Poderes." },
];
