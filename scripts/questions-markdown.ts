import { QUESTIONS } from "../src/data/questions";
import { TOPICS } from "../src/data/topics";
import { CANDIDATES } from "../src/data/candidates";
import { CONTEXT_NOTE_BY_ID } from "../src/data/context-notes";
import { PRIORITY_LEVELS, type CandidatePosition, type PositionDirection, type Question } from "../src/domain/types";
import { compareAnswerToPosition } from "../src/domain/comparison";

/**
 * Gera a lista completa de perguntas, alternativas e pesos por candidato para o README.
 * Fontes: src/data/questions.ts e as posições PUBLICADAS no banco.
 * Uso: npm run docs:questions. Não edite a lista no README à mão.
 */
export const START = "<!-- perguntas:inicio (gerado por npm run docs:questions; não edite à mão) -->";
export const END = "<!-- perguntas:fim -->";

const fmt = (v: number | null) => (v === null ? "—" : v > 0 ? `+${v}` : String(v));

const DIRECTION_LABEL: Record<PositionDirection, string> = {
  SUPPORTS: "apoia (+2)",
  PARTIALLY_SUPPORTS: "apoia em parte (+1)",
  NEUTRAL: "neutro (0)",
  PARTIALLY_OPPOSES: "opõe-se em parte (−1)",
  OPPOSES: "opõe-se (−2)",
  UNCLEAR: "pouco clara",
};

/** Peso que a alternativa soma no score do candidato: 1 igual, 0,5 parecida, 0 diferente ou silêncio. */
export function optionWeight(q: Question, optionId: string, position: CandidatePosition | null): string {
  const r = compareAnswerToPosition(q, { questionId: q.id, optionIds: [optionId] }, position);
  if (r === null) return "fora da conta";
  if (r === "SIMILAR") return "1";
  if (r === "PARTIALLY_SIMILAR") return "0,5";
  return "0";
}

function describePosition(q: Question, p: CandidatePosition | null): string {
  if (!p || p.reviewStatus !== "PUBLISHED") return "sem posição publicada (regra do silêncio: 0 em todas as alternativas)";
  if (p.direction === "UNCLEAR") return "posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)";
  const ordinal = q.options.every((o) => o.isNoOpinion || o.normalizedValue !== null);
  if (ordinal) return DIRECTION_LABEL[p.direction];
  const closest = q.options.find((o) => o.id === p.closestOptionId);
  return closest ? `alternativa mais próxima: “${closest.label}”` : "sem alternativa correspondente (0 em todas)";
}

export function questionsMarkdown(positions: CandidatePosition[], snapshot: string): string {
  const pos = (cid: string, qid: string) => positions.find((p) => p.candidateId === cid && p.questionId === qid && p.reviewStatus === "PUBLISHED") ?? null;
  const out: string[] = [START, ""];
  out.push(`Escala de importância, perguntada ao fim de cada tema: ${PRIORITY_LEVELS.map((l) => `${l.label} (${l.value})`).join(" · ")}. Ela só ordena o relatório e nunca altera pesos.`, "");
  out.push(
    "Como ler as tabelas:",
    "",
    "- **Escala** é o valor da alternativa na etapa 1 do algoritmo. \"—\" indica alternativa sem escala, comparada pela posição na lista.",
    `- **Peso ${CANDIDATES.map((c) => c.name).join("** e **Peso ")}** é quanto a alternativa soma no numerador do score do tema para aquele candidato: 1 = igual, 0,5 = parecida, 0 = diferente ou candidato sem posição publicada. Toda pergunta respondida conta 1 no denominador.`,
    "- \"Não sei\" fica fora da conta: não soma no numerador nem no denominador.",
    `- Os pesos refletem as posições publicadas em ${snapshot}. Quando uma posição é revisada, os pesos mudam e esta lista é regenerada.`,
    "",
  );
  let n = 0;
  for (const t of [...TOPICS].sort((a, b) => a.order - b.order)) {
    out.push(`### ${t.order}. ${t.name}`, "", `_${t.description}_`, "");
    for (const q of QUESTIONS.filter((x) => x.topicId === t.id).sort((a, b) => a.order - b.order)) {
      n++;
      out.push(`**${n}. ${q.text}**${q.kind === "MULTI_CHOICE" ? " _(permite mais de uma)_" : ""}`, "");
      for (const note of (q.contextNoteIds ?? []).map((id) => CONTEXT_NOTE_BY_ID[id]).filter(Boolean)) out.push(`> Contexto exibido antes: ${note.title}.`, "");
      for (const c of CANDIDATES) out.push(`- Posição documentada de ${c.name}: ${describePosition(q, pos(c.id, q.id))}`);
      out.push("");
      out.push(`| Alternativa | Escala | ${CANDIDATES.map((c) => `Peso ${c.name}`).join(" | ")} |`, `|---|---|${CANDIDATES.map(() => "---").join("|")}|`);
      for (const o of q.options) {
        const w = CANDIDATES.map((c) => (o.isNoOpinion ? "fora" : optionWeight(q, o.id, pos(c.id, q.id))));
        out.push(`| ${o.label} | ${o.isNoOpinion ? "fora da conta" : fmt(o.normalizedValue)} | ${w.join(" | ")} |`);
      }
      out.push("");
    }
    if (t.priorityQuestion) out.push(`**${t.priorityQuestion}** ${PRIORITY_LEVELS.map((l) => l.label).join(" · ")}`, "");
  }
  out.push(END);
  return out.join("\n");
}
