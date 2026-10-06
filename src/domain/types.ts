/**
 * Tipos de domínio compartilhados entre dados estáticos (seed), Prisma e UI.
 *
 * Princípio: "Você decide. Nós organizamos as evidências."
 * Nenhum tipo aqui representa pontuação eleitoral, ranking ou candidato vencedor.
 */

// ---------------------------------------------------------------------------
// Perguntas
// ---------------------------------------------------------------------------

/** Tipo de escala da pergunta. */
export type QuestionKind =
  /** Escala de concordância padrão (5 opções). */
  | "AGREEMENT"
  /** Alternativas específicas, escolha única. */
  | "SINGLE_CHOICE"
  /** Alternativas específicas, permite mais de uma. */
  | "MULTI_CHOICE";

export interface QuestionOption {
  id: string;
  label: string;
  order: number;
  /**
   * Normalização interna (2, 1, 0, -1, -2) usada SOMENTE para organizar as
   * respostas e gráficos do próprio usuário. Nunca é somada contra posições
   * de candidatos. `null` para alternativas sem escala ordinal.
   */
  normalizedValue: number | null;
  /** Alternativa "Não sei". */
  isNoOpinion: boolean;
}

export interface Question {
  id: string;
  topicId: string;
  /** Subtema opcional (ex.: "Jornada de trabalho", "Semicondutores"). */
  subtopic?: string;
  order: number;
  text: string;
  kind: QuestionKind;
  options: QuestionOption[];
  /** Notas de contexto (legal, conceitual ou histórico) exibidas antes da pergunta. */
  contextNoteIds?: string[];
  /** Id do bloco "Entenda os argumentos" (argumentos do debate público, não fatos). */
  argumentsId?: string;
  /** Dimensões que a evidência deve diferenciar ao apresentar candidatos. */
  evidenceDistinctions?: string[];
}

export interface Topic {
  id: string;
  slug: string;
  order: number;
  name: string;
  description: string;
  subtopics?: string[];
  /** Texto da pergunta de importância exibida ao final do tema. */
  priorityQuestion?: string;
}

// ---------------------------------------------------------------------------
// Importância dos temas (usada EXCLUSIVAMENTE para ordenar o relatório)
// ---------------------------------------------------------------------------

export const PRIORITY_LEVELS = [
  { value: 0, label: "Não importa" },
  { value: 1, label: "Importa pouco" },
  { value: 2, label: "Importa" },
  { value: 3, label: "Importa muito" },
  { value: 4, label: "É uma das coisas mais importantes para mim" },
] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number]["value"];

// ---------------------------------------------------------------------------
// Fontes e evidências
// ---------------------------------------------------------------------------

export type SourceType =
  | "government_plan"
  | "legislation"
  | "bill"
  | "roll_call_vote"
  | "official_statistics"
  | "official_speech"
  | "official_interview"
  | "government_database"
  | "academic_research"
  | "international_organization"
  | "professional_press"
  | "other";

/** Legenda visual de fonte apresentada ao usuário. */
export type SourceLegend =
  | "PRIMARIA"
  | "ESTATISTICA"
  | "INSTITUCIONAL"
  | "ACADEMICA"
  | "JORNALISTICA";

export const SOURCE_LEGEND_LABELS: Record<SourceLegend, { label: string; meaning: string }> = {
  PRIMARIA: {
    label: "Fonte primária",
    meaning:
      "Documento original: lei, decreto, projeto, votação nominal, programa registrado no TSE ou publicação diretamente atribuída ao candidato.",
  },
  ESTATISTICA: {
    label: "Fonte estatística",
    meaning:
      "Indicador produzido por órgão estatístico oficial ou organismo internacional, sempre com período de referência e metodologia.",
  },
  INSTITUCIONAL: {
    label: "Fonte institucional",
    meaning:
      "Informação de um órgão público sobre suas próprias competências, programas ou estrutura. Não é usada para avaliar candidatos.",
  },
  ACADEMICA: {
    label: "Pesquisa acadêmica",
    meaning: "Estudo revisado por pares ou relatório técnico de organização independente.",
  },
  JORNALISTICA: {
    label: "Fonte jornalística",
    meaning:
      "Reportagem de veículo profissional. Usada apenas quando o documento original não está disponível, nunca como única base de uma posição.",
  },
};

/** Força documental (hierarquia das evidências). */
export type EvidenceStrength = "A" | "B" | "C" | "D";

export const EVIDENCE_STRENGTH_LABELS: Record<EvidenceStrength, { label: string; examples: string }> = {
  A: {
    label: "Nível A — Fonte primária direta",
    examples:
      "Programa registrado no TSE, lei, decreto, projeto legislativo, votação nominal, dados estatísticos oficiais, execução orçamentária.",
  },
  B: {
    label: "Nível B — Manifestação pública primária",
    examples: "Entrevista integral, pronunciamento, discurso oficial, publicação diretamente atribuída ao candidato.",
  },
  C: {
    label: "Nível C — Fonte secundária qualificada",
    examples: "Reportagem profissional, pesquisa acadêmica, relatório de organização independente.",
  },
  D: {
    label: "Nível D — Interpretação ou comentário",
    examples:
      "Editorial, coluna de opinião, comentário de terceiros. Nunca determina sozinha a posição de um candidato.",
  },
};

/** Classificação da evidência. As categorias nunca se misturam. */
export type EvidenceClassification = "PROPOSTA" | "POSICAO" | "ATUACAO" | "RESULTADO_OBSERVADO";

export const EVIDENCE_CLASSIFICATION_LABELS: Record<EvidenceClassification, { label: string; meaning: string }> = {
  PROPOSTA: { label: "Proposta", meaning: "Algo que o candidato afirma que pretende implementar." },
  POSICAO: { label: "Posição", meaning: "Algo que o candidato afirma defender." },
  ATUACAO: {
    label: "Atuação",
    meaning: "Projeto, voto, decreto, sanção, veto, decisão administrativa ou outra ação documentada.",
  },
  RESULTADO_OBSERVADO: {
    label: "Resultado observado",
    meaning:
      "Indicador estatístico observado em determinado período. Não é prova automática de causalidade.",
  },
};

export type ReviewStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED";

/** Direção da posição documentada em relação ao enunciado da pergunta. */
export type PositionDirection =
  | "SUPPORTS"
  | "PARTIALLY_SUPPORTS"
  | "NEUTRAL"
  | "PARTIALLY_OPPOSES"
  | "OPPOSES"
  | "UNCLEAR";

export type VerificationStatus = "VERIFIED" | "PENDING_MANUAL" | "UNVERIFIED";

export interface SourceRegistryEntry {
  id: string;
  name: string;
  institution: string;
  url: string;
  documentUrl?: string;
  type: SourceType;
  legend: SourceLegend;
  /** Para que esta fonte pode ser usada. */
  purpose: string;
  /** Restrições explícitas de uso (ex.: "não usar para avaliar candidatos"). */
  usageRestrictions?: string;
  publishedAt?: string;
  retrievedAt?: string;
  verification: {
    status: VerificationStatus;
    checkedAt?: string;
    note?: string;
  };
  notes?: string;
}

export interface Candidate {
  id: string;
  slug: string;
  name: string;
  /** Cargo relevante para a métrica de histórico (Executivo vs parlamentar). */
  roleContext: string;
  /** Fontes institucionais do histórico do candidato. */
  historySourceIds: string[];
}

export interface Evidence {
  id: string;
  candidateId: string;
  questionId: string | null;
  topicId: string;
  title: string;
  summary: string;
  originalExcerpt: string;
  sourceId: string;
  sourceType: SourceType;
  eventDate: string | null;
  publicationDate: string | null;
  retrievedAt: string;
  classification: EvidenceClassification;
  evidenceStrength: EvidenceStrength;
  reviewStatus: ReviewStatus;
  /** Critério usado na classificação (exibido em "Por que estou vendo isso?"). */
  classificationCriterion?: string;
  /**
   * Situação jurídica do que a evidência descreve:
   * true = já em vigor; false = apenas proposta ou em tramitação; null = não se aplica.
   * Nunca marcar true para algo ainda em tramitação.
   */
  inForce?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidatePosition {
  id: string;
  candidateId: string;
  questionId: string;
  direction: PositionDirection;
  /** Alternativa da pergunta mais próxima da posição documentada, se houver. */
  closestOptionId: string | null;
  summary: string;
  /** Dimensão específica (ex.: "BRICS", "Mercosul") quando a pergunta exige separação. */
  dimension?: string;
  evidenceIds: string[];
  reviewStatus: ReviewStatus;
  /** Cronologia quando houve mudança de posição documentada. */
  timeline?: { date: string; text: string; evidenceId: string }[];
  updatedAt: string;
}

export interface Indicator {
  id: string;
  name: string;
  surveyName: string;
  institution: string;
  sourceId: string;
  value: number;
  unit: string;
  /** Período de referência (obrigatório). */
  referencePeriod: string;
  releasedAt: string;
  methodologyNote?: string;
  /** Políticas implementadas no mesmo período (contexto, não causalidade). */
  contemporaneousPolicies?: string[];
  reviewStatus: ReviewStatus;
}

/** Etiqueta do resumo de programa em relação às regras atuais. */
export type ProgramActionLabel = "MANTER" | "AMPLIAR" | "CRIAR" | "MUDAR" | "REDUZIR" | "SEM_PROPOSTA_CLARA";

export const PROGRAM_ACTION_LABELS: Record<ProgramActionLabel, string> = {
  MANTER: "Manter",
  AMPLIAR: "Ampliar",
  CRIAR: "Criar",
  MUDAR: "Mudar",
  REDUZIR: "Reduzir",
  SEM_PROPOSTA_CLARA: "Não há proposta clara",
};

export interface ProgramSummary {
  id: string;
  candidateId: string;
  themeKey: string;
  title: string;
  summary: string;
  documentalStatus: string;
  actionLabel?: ProgramActionLabel | null;
  sourceId: string;
  documentDate: string | null;
  proposalDetails?: {
    whatIsProposed?: string;
    howItWouldWork?: string;
    dependsOnCongress?: string;
    executiveCanDo?: string;
  };
  reviewStatus: ReviewStatus;
}

// ---------------------------------------------------------------------------
// Contexto, argumentos, metodologia
// ---------------------------------------------------------------------------

export type ContextNoteKind = "LEGAL" | "CONCEPTUAL" | "HISTORICAL";

export interface TimelineEvent {
  date: string;
  text: string;
  sourceId: string;
}

export interface ContextNote {
  id: string;
  kind: ContextNoteKind;
  title: string;
  paragraphs: string[];
  sourceIds: string[];
  /** Data de referência da informação ("vigente em"). */
  asOf: string;
  timeline?: TimelineEvent[];
}

export interface ArgumentSet {
  id: string;
  policy: string;
  inFavor: string[];
  against: string[];
}

export interface MethodologyVersion {
  id: string;
  version: string;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveUntil: string | null;
  createdAt: string;
  changeLog: string[];
}

export interface ResearchProtocol {
  id: string;
  questionId: string;
  topic: string;
  subtopic: string;
  searchTerms: string[];
  sourceIds: string[];
  period: string;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  definedAt: string;
}

// ---------------------------------------------------------------------------
// Respostas do usuário (ficam no navegador)
// ---------------------------------------------------------------------------

export interface UserAnswer {
  questionId: string;
  optionIds: string[];
}

export interface TopicPriority {
  topicId: string;
  level: PriorityLevel;
}

export type AgeRange = "16-24" | "25-34" | "35-44" | "45-59" | "60+" | "prefiro-nao-responder";
export type Region =
  | "norte"
  | "nordeste"
  | "centro-oeste"
  | "sudeste"
  | "sul"
  | "exterior"
  | "prefiro-nao-responder";

export const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "16-24", label: "16 a 24" },
  { value: "25-34", label: "25 a 34" },
  { value: "35-44", label: "35 a 44" },
  { value: "45-59", label: "45 a 59" },
  { value: "60+", label: "60 ou mais" },
  { value: "prefiro-nao-responder", label: "Prefiro não responder" },
];

export const REGIONS: { value: Region; label: string }[] = [
  { value: "norte", label: "Norte" },
  { value: "nordeste", label: "Nordeste" },
  { value: "centro-oeste", label: "Centro-Oeste" },
  { value: "sudeste", label: "Sudeste" },
  { value: "sul", label: "Sul" },
  { value: "exterior", label: "Exterior" },
  { value: "prefiro-nao-responder", label: "Prefiro não responder" },
];

/** Indicador visual por questão. Nunca consolidado em ranking. */
export type ComparisonIndicator = "SIMILAR" | "PARTIALLY_SIMILAR" | "DIFFERENT" | "INSUFFICIENT_EVIDENCE";

export const COMPARISON_LABELS: Record<ComparisonIndicator, string> = {
  SIMILAR: "Igual a você: sua resposta e a posição documentada do candidato coincidem (distância 0).",
  PARTIALLY_SIMILAR: "Parecido com você: um passo de distância na escala (distância 1).",
  DIFFERENT: "Diferente de você: dois passos ou mais de distância.",
  INSUFFICIENT_EVIDENCE: "Não se posicionou nas fontes oficiais: conta como diferente para o candidato, sem atribuir a ele nenhuma posição.",
};

export const NO_EVIDENCE_MESSAGE =
  "Não encontramos posição suficientemente documentada deste candidato sobre esta questão.";

export const NO_SPECIFIC_PROPOSAL_MESSAGE =
  "Não encontramos proposta suficientemente específica sobre este assunto nos documentos consultados.";

// ---------------------------------------------------------------------------
// Perfil público do candidato ("Conheça melhor os candidatos")
// ---------------------------------------------------------------------------

/** Item factual com fonte. `verified` indica se o item foi conferido na fonte indicada. */
export interface SourcedFact {
  text: string;
  sourceIds: string[];
  verified: boolean;
  /** Trecho utilizado, quando disponível. */
  excerpt?: string;
  date?: string;
  /** Documentos específicos que comprovam o fato (ex.: cada projeto de lei), com link direto. */
  links?: { label: string; url: string }[];
}

export interface PositionHeld {
  title: string;
  from: string;
  to: string | null;
  branch: "LEGISLATIVO" | "EXECUTIVO";
  sourceIds: string[];
  verified: boolean;
}

export interface CandidateProfile {
  candidateId: string;
  shortBio: SourcedFact;
  /** Experiência profissional antes (ou fora) dos cargos públicos, com fonte por item. */
  professionalExperience?: SourcedFact[];
  trajectoryStart: { year: number; basis: string };
  firstElection: { year: number; office: string };
  approxYearsOfExperience: { years: number; until: number; note: string };
  timeline: SourcedFact[];
  positionsHeld: PositionHeld[];
  governmentExperience: SourcedFact[];
  /** Categorias em que a atuação documentada será organizada (conteúdo vem de Evidence). */
  documentedActionCategories: string[];
  /** Links oficiais para consulta do histórico. */
  officialLinks: { label: string; sourceId: string; note?: string }[];
  /**
   * Principais projetos, programas e leis ligados ao candidato, só com o nome, o ano e o link
   * para o documento oficial. Sem avaliação: a pessoa abre e lê.
   */
  keyInitiatives?: KeyInitiative[];
  /** Principais propostas e posições por tema, em linguagem simples, cada uma com as páginas do programa registrado no TSE. */
  programHighlights?: { theme: string; text: string; sourceId: string; pages: number[]; url?: string; label?: string; group?: string }[];
}

export interface KeyInitiative {
  title: string;
  year: string;
  /** Ex.: "Lei sancionada", "Decreto", "Projeto de lei (autor)", "PEC (autor)". */
  kind: string;
  sourceId: string;
  /** Página oficial do documento. */
  url: string;
  verified: boolean;
  excerpt?: string;
}

/** Linha da tabela de comparação de experiência. */
export interface ExperienceRow {
  label: string;
  byCandidate: Record<string, string>;
}

export const EXPERIENCE_DISCLAIMER =
  "Quantidade de anos de experiência não significa automaticamente maior ou menor capacidade para governar. Esta informação é apresentada apenas para contextualizar a trajetória pública de cada candidato.";

/** Critérios objetivos para escolher os pontos centrais de um programa. */
export const QUICK_POINTS_CRITERIA = [
  "propostas destacadas repetidamente no documento",
  "propostas apresentadas como prioridade pela própria candidatura",
  "mudanças importantes em relação às regras atuais",
  "políticas que atingem grande parcela da população",
  "grandes alterações institucionais propostas",
];
