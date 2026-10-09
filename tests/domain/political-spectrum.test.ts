import { describe, expect, it } from "vitest";
import { bandAt, personSpectrum } from "@/data/political-spectrum";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { SPECTRUM_SECTIONS, SPECTRUM_TERMS } from "@/data/spectrum-terms";
import { QUESTIONS } from "@/data/questions";

const a = (questionId: string, o: string) => ({ questionId, optionIds: [`${questionId}-${o}`] });

describe("régua do espectro político (posição pelas respostas)", () => {
  it("toda alternativa (menos 'Não sei') tem posição na tabela", () => {
    const missing = QUESTIONS.flatMap((q) => q.options.filter((o) => !o.isNoOpinion && !spectrumPositionOf(q.id, o.id)).map((o) => o.id));
    expect(missing).toEqual([]);
  });
  it("a pessoa fica na média do meio das faixas das alternativas", () => {
    expect(personSpectrum([a("q01", "o1"), a("q05", "o1")])).toMatchObject({ at: 1.5, ideology: "Socialismo" });
    expect(personSpectrum([a("q01", "o4"), a("q05", "o3")])).toMatchObject({ at: 5.5, ideology: "Liberalismo econômico e conservadorismo" });
  });
  it("centro é centro (não centro-direita)", () => {
    expect(personSpectrum([a("q01", "o1"), a("q05", "o3")])).toMatchObject({ at: 3.5, ideology: "Centro político" });
    expect(personSpectrum([a("q03", "o3")])).toMatchObject({ at: 3.5, ideology: "Centro político" });
  });
  it("revisão humana: investir em educação (pobreza) é centro-esquerda", () => {
    expect(personSpectrum([a("q20", "o4")])).toMatchObject({ at: 2.5, ideology: "Social-democracia" });
  });
  it("'Não sei' e respostas sem posição não entram; sem nada, sem posição", () => {
    const noOpinion = QUESTIONS[0].options.find((o) => o.isNoOpinion)!;
    expect(personSpectrum([{ questionId: QUESTIONS[0].id, optionIds: [noOpinion.id] }])).toBeNull();
    expect(personSpectrum([])).toBeNull();
  });
  it("faixas e divisas", () => {
    expect(bandAt(7.5)).toBe("Extrema direita");
    expect(bandAt(3)).toBe("entre centro-esquerda e centro");
  });
  it("todo termo da régua abre uma seção com texto", () => {
    const ids = new Set(SPECTRUM_SECTIONS.map((s) => s.id));
    for (const t of SPECTRUM_TERMS) expect(ids.has(t.section)).toBe(true);
  });
});
