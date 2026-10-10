import { afterEach, describe, expect, it } from "vitest";
import { BASELINE_CONFIG, applyConfig, applyScope, buildOptions, diffConfig, nextQuestionId, rebaseDraft, scopeChanged, validateConfig, type LiveConfig } from "@/lib/live-config";
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

describe("pedidos de um item só (como pull requests)", () => {
  it("aplica só o item sobre a versão no ar, mesmo que ela tenha mudado depois", async () => {
    const { applyScope, scopeChanged, sameJson } = await import("@/lib/live-config");
    const draft = clone(BASELINE_CONFIG);
    draft.optionScores["q09|flavio-bolsonaro|o3"] = [1, "t"];
    draft.spectrumPositions["q01|o1"] = ["Direita", "t"];
    const scope = { kind: "scores" as const, questionId: "q09" };
    expect(scopeChanged(BASELINE_CONFIG, draft, scope)).toBe(true);
    const live2 = clone(BASELINE_CONFIG); live2.candidates.lula = 3.3; // outra mudança publicada antes
    const target = applyScope(live2, draft, scope);
    expect(target.optionScores["q09|flavio-bolsonaro|o3"][0]).toBe(1);
    expect(target.spectrumPositions["q01|o1"][0]).toBe("Esquerda"); // a outra mudança do rascunho não vai junto
    expect(target.candidates.lula).toBe(3.3); // não desfaz o que já estava no ar
    expect(sameJson({ a: 1, b: [2, { c: 3, d: 4 }] }, { b: [2, { d: 4, c: 3 }], a: 1 })).toBe(true);
  });
  it("textos: muda só o trecho enviado", async () => {
    const { applyScope, contentOf } = await import("@/lib/live-config");
    const draft = clone(BASELINE_CONFIG);
    contentOf(draft).pages.home.headline = "Novo título";
    contentOf(draft).pages.footer.about = "Outro rodapé";
    const target = applyScope(BASELINE_CONFIG, draft, { kind: "content", path: ["pages", "home"] });
    expect(contentOf(target).pages.home.headline).toBe("Novo título");
    expect(contentOf(target).pages.footer.about).toBe(contentOf(BASELINE_CONFIG).pages.footer.about);
  });
});

describe("envio de notas e faixas juntas", () => {
  it("leva as notas e as faixas da pergunta, e nada de outra pergunta", () => {
    const base = BASELINE_CONFIG;
    const draft = JSON.parse(JSON.stringify(base)) as typeof base;
    const [k1] = Object.keys(draft.optionScores).filter((k) => k.startsWith("q01|"));
    const [b1] = Object.keys(draft.spectrumPositions).filter((k) => k.startsWith("q01|"));
    const [other] = Object.keys(draft.optionScores).filter((k) => k.startsWith("q03|"));
    draft.optionScores[k1] = [draft.optionScores[k1][0] === 1 ? 0 : 1, "teste"];
    draft.spectrumPositions[b1] = [draft.spectrumPositions[b1][0] === "Direita" ? "Esquerda" : "Direita", "teste"];
    draft.optionScores[other] = [draft.optionScores[other][0] === 1 ? 0 : 1, "teste"];
    const out = applyScope(base, draft, { kind: "calc", questionId: "q01" });
    expect(out.optionScores[k1]).toEqual(draft.optionScores[k1]);
    expect(out.spectrumPositions[b1]).toEqual(draft.spectrumPositions[b1]);
    expect(out.optionScores[other]).toEqual(base.optionScores[other]);
    expect(scopeChanged(base, draft, { kind: "calc", questionId: "q01" })).toBe(true);
    expect(scopeChanged(base, out, { kind: "calc", questionId: "q03" })).toBe(false);
  });
});

describe("rascunho por cima da versão no ar", () => {
  const withText = (cfg: LiveConfig, qid: string, text: string): LiveConfig => {
    const c = clone(cfg);
    c.questions.find((q) => q.id === qid)!.text = text;
    return c;
  };
  const textOf = (cfg: LiveConfig, qid: string) => cfg.questions.find((q) => q.id === qid)!.text;

  it("enviar o rascunho depois de aprovar um item não desfaz o item (caso da pergunta 16)", () => {
    const [qa, qb] = [QUESTIONS[0].id, QUESTIONS[1].id];
    const v8 = clone(BASELINE_CONFIG);
    // rascunho com duas mudanças; o item A é enviado sozinho e sai do rascunho
    const draft = withText(withText(v8, qa, "A novo"), qb, "B novo");
    const rest = applyScope(draft, v8, { kind: "question", id: qa });
    const v9 = applyScope(v8, draft, { kind: "question", id: qa });
    const working = rebaseDraft(v8, rest, v9);
    expect(textOf(working, qa)).toBe("A novo");
    expect(textOf(working, qb)).toBe("B novo");
    expect(diffConfig(v9, working).length).toBe(1);
  });

  it("mantém mudanças do rascunho e do ar em partes diferentes, inclusive notas, régua e textos", () => {
    const base = clone(BASELINE_CONFIG);
    const k = Object.keys(base.optionScores)[0];
    const draft = clone(base); draft.optionScores[k] = [0.5, "rascunho"]; draft.rightSideFrom = base.rightSideFrom + 0.1;
    const live = withText(base, QUESTIONS[2].id, "no ar");
    const out = rebaseDraft(base, draft, live);
    expect(out.optionScores[k]).toEqual([0.5, "rascunho"]);
    expect(out.rightSideFrom).toBe(base.rightSideFrom + 0.1);
    expect(textOf(out, QUESTIONS[2].id)).toBe("no ar");
    expect(validateConfig(out)).toEqual([]);
  });

  it("pergunta nova no rascunho continua; sem mudanças no ar, o rascunho fica igual", () => {
    const base = clone(BASELINE_CONFIG);
    const draft = clone(base); draft.questions.push({ ...clone(QUESTIONS[0]), id: "q99", text: "nova" });
    expect(rebaseDraft(base, draft, base).questions.at(-1)!.id).toBe("q99");
    const live = withText(base, QUESTIONS[0].id, "no ar");
    const out = rebaseDraft(base, draft, live);
    expect(out.questions.at(-1)!.id).toBe("q99");
    expect(textOf(out, QUESTIONS[0].id)).toBe("no ar");
  });
});
