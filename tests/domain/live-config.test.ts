import { afterEach, describe, expect, it } from "vitest";
import { BASELINE_CONFIG, applyConfig, buildOptions, diffConfig, nextQuestionId, validateConfig } from "@/lib/live-config";
import { computeImpact } from "@/lib/config-impact";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { OPTION_SCORES } from "@/data/option-scores";
import { CANDIDATE_SPECTRUM, RULER_RULES, closestCandidateOnRuler, personSpectrum } from "@/data/political-spectrum";
import type { Candidate } from "@/domain/types";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const a = (questionId: string, o: string) => ({ questionId, optionIds: [`${questionId}-${o}`] });
const CANDS = [{ id: "lula", name: "Lula" }, { id: "flavio-bolsonaro", name: "Flávio Bolsonaro" }] as unknown as Candidate[];

afterEach(() => applyConfig(BASELINE_CONFIG));

describe("configuração viva (admin editável)", () => {
  it("a versão inicial é exatamente o que está no código e passa na validação", () => {
    expect(validateConfig(BASELINE_CONFIG)).toEqual([]);
    const before = { n: QUESTIONS.length, num: { ...QUESTION_NUMBER }, s: JSON.stringify(OPTION_SCORES), p: personSpectrum([a("q01", "o1"), a("q05", "o3")]) };
    applyConfig(clone(BASELINE_CONFIG), "teste");
    expect(QUESTIONS.length).toBe(before.n);
    expect(QUESTION_NUMBER).toEqual(before.num);
    expect(JSON.stringify(OPTION_SCORES)).toBe(before.s);
    expect(personSpectrum([a("q01", "o1"), a("q05", "o3")])).toEqual(before.p);
  });

  it("mudar nota, faixa, régua e linha divisória muda a conta, e voltar restaura", () => {
    const cfg = clone(BASELINE_CONFIG);
    cfg.optionScores["q01|flavio-bolsonaro|o1"] = [1, "teste"];
    cfg.spectrumPositions["q01|o1"] = ["Direita", "teste"];
    cfg.candidates.lula = 3.3;
    cfg.rightSideFrom = 6;
    applyConfig(cfg, "teste2");
    expect(OPTION_SCORES["q01|flavio-bolsonaro|o1"][0]).toBe(1);
    expect(personSpectrum([a("q01", "o1")])!.at).toBe(5.5);
    expect(CANDIDATE_SPECTRUM.lula.at).toBe(3.3);
    expect(RULER_RULES.rightSideFrom).toBe(6);
    expect(closestCandidateOnRuler(6.2, ["lula", "flavio-bolsonaro"])).toBe("flavio-bolsonaro");
    applyConfig(BASELINE_CONFIG);
    expect(personSpectrum([a("q01", "o1")])!.at).toBe(1.5);
    expect(RULER_RULES.rightSideFrom).toBe(BASELINE_CONFIG.rightSideFrom);
  });

  it("pergunta nova entra na numeração; arquivada sai da conta mas continua reconhecida", () => {
    const cfg = clone(BASELINE_CONFIG);
    const id = nextQuestionId(cfg);
    expect(id).toBe("q54");
    const options = buildOptions(id, ["Sim", "Não"]);
    cfg.questions.push({ id, topicId: "t01", order: 99, text: "Pergunta nova?", kind: "SINGLE_CHOICE", options });
    expect(validateConfig(cfg).length).toBeGreaterThan(0); // faltam notas e faixas
    for (const o of options.filter((x) => !x.isNoOpinion)) {
      cfg.optionScores[`${id}|lula|${o.id.split("-").pop()}`] = [1, "x"];
      cfg.optionScores[`${id}|flavio-bolsonaro|${o.id.split("-").pop()}`] = [0, "x"];
      cfg.spectrumPositions[`${id}|${o.id.split("-").pop()}`] = ["Centro", "x"];
    }
    cfg.archived = ["q03"];
    expect(validateConfig(cfg)).toEqual([]);
    applyConfig(cfg, "teste3");
    expect(QUESTIONS.length).toBe(BASELINE_CONFIG.questions.length); // +1 nova, −1 arquivada
    expect(QUESTION_NUMBER[id]).toBeTruthy();
    expect(QUESTION_NUMBER.q03).toBeUndefined();
    expect(QUESTION_BY_ID.q03).toBeTruthy();
  });

  it("a validação barra correntes cruzadas e linha fora do lugar", () => {
    const cfg = clone(BASELINE_CONFIG);
    cfg.terms.Socialismo = 0.01;
    cfg.rightSideFrom = 8;
    const errs = validateConfig(cfg);
    expect(errs.some((e) => e.includes("Socialismo"))).toBe(true);
    expect(errs.some((e) => e.includes("linha divisória"))).toBe(true);
  });

  it("o diff descreve as mudanças e o impacto usa as respostas reais", () => {
    const to = clone(BASELINE_CONFIG);
    to.spectrumPositions["q01|o1"] = ["Direita", "teste"];
    const changes = diffConfig(BASELINE_CONFIG, to, QUESTION_NUMBER);
    expect(changes).toEqual([{ section: "Espectro político", text: 'Pergunta 1 · "Concordo": Esquerda → Direita' }]);
    const subs = [{ answers: [a("q01", "o1")] }, { answers: [a("q05", "o1")] }];
    const impact = computeImpact(subs, CANDS, [], BASELINE_CONFIG, to, BASELINE_CONFIG);
    expect(impact.ideologyChanged).toBe(1);
    expect(impact.total).toBe(2);
    expect(personSpectrum([a("q01", "o1")])!.at).toBe(1.5); // voltou ao publicado
  });
});
