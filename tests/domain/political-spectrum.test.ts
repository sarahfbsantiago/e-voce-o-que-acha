import { describe, expect, it } from "vitest";
import { bandAt, personSpectrum } from "@/data/political-spectrum";
import { SPECTRUM_SECTIONS, SPECTRUM_TERMS } from "@/data/spectrum-terms";

describe("régua do espectro político", () => {
  it("a pessoa fica na ideologia do candidato com mais temas", () => {
    expect(personSpectrum([{ candidateId: "lula", themes: 8 }, { candidateId: "flavio-bolsonaro", themes: 2 }])).toEqual({ at: 3, ideology: "Progressismo", closestCandidateId: "lula" });
    expect(personSpectrum([{ candidateId: "lula", themes: 1 }, { candidateId: "flavio-bolsonaro", themes: 6 }])).toEqual({ at: 7.5, ideology: "Extrema direita", closestCandidateId: "flavio-bolsonaro" });
  });
  it("empate → no meio dos dois, sem candidato", () => {
    const p = personSpectrum([{ candidateId: "lula", themes: 4 }, { candidateId: "flavio-bolsonaro", themes: 4 }])!;
    expect(p.at).toBeCloseTo(5.25);
    expect(p.closestCandidateId).toBeNull();
  });
  it("sem tema decidido → sem posição", () => {
    expect(personSpectrum([{ candidateId: "lula", themes: 0 }, { candidateId: "flavio-bolsonaro", themes: 0 }])).toBeNull();
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
