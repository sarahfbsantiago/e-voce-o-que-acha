import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { optionWeight } from "../../scripts/questions-markdown";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import type { CandidatePosition } from "@/domain/types";

const readme = readFileSync(join(__dirname, "..", "..", "README.md"), "utf8");

describe("README: perguntas e pesos", () => {
  it("traz todas as perguntas e alternativas (rode `npm run docs:questions` se falhar)", () => {
    for (const q of QUESTIONS) {
      expect(readme).toContain(q.text);
      for (const o of q.options) expect(readme).toContain(`| ${o.label} |`);
    }
  });
  it("pesos seguem o algoritmo: 1 igual, 0,5 parecida, 0 diferente, 0 sem posição", () => {
    const q = QUESTION_BY_ID.q01; // Concordo +2 · em parte +1 · Discordo em parte −1 · Discordo −2
    const p: CandidatePosition = { id: "p", candidateId: "x", questionId: "q01", direction: "SUPPORTS", closestOptionId: null, summary: "", evidenceIds: [], reviewStatus: "PUBLISHED", updatedAt: "x" };
    expect(q.options.map((o) => optionWeight(q, o.id, p))).toEqual(["1", "0,5", "0", "0", "fora da conta"]);
    expect(optionWeight(q, "q01-o1", null)).toBe("0");
  });
});
