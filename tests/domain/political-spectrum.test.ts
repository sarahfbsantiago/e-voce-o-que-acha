import { describe, expect, it } from "vitest";
import { bandAt, personSpectrumPosition } from "@/data/political-spectrum";

describe("régua do espectro político", () => {
  it("todos os temas com um candidato → a pessoa fica na posição dele", () => {
    expect(personSpectrumPosition([{ candidateId: "lula", themes: 8 }, { candidateId: "flavio-bolsonaro", themes: 0 }])).toBe(3);
    expect(bandAt(7.5)).toBe("Extrema direita");
  });
  it("divisão dos temas → posição proporcional entre os dois", () => {
    const at = personSpectrumPosition([{ candidateId: "lula", themes: 3 }, { candidateId: "flavio-bolsonaro", themes: 1 }])!;
    expect(at).toBeCloseTo(4.125);
    expect(bandAt(at)).toBe("Centro-direita");
  });
  it("sem tema decidido → sem posição", () => {
    expect(personSpectrumPosition([{ candidateId: "lula", themes: 0 }, { candidateId: "flavio-bolsonaro", themes: 0 }])).toBeNull();
  });
});
