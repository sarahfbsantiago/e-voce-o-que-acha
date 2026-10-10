import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SPECTRUM_HISTORY } from "@/data/spectrum-history";
import { SPECTRUM_TERMS } from "@/data/spectrum-terms";

describe("Na história (cards do espectro)", () => {
  it("todo termo da régua tem história, e toda foto existe com crédito", () => {
    for (const t of SPECTRUM_TERMS) expect(SPECTRUM_HISTORY[t.label] ?? SPECTRUM_HISTORY[t.section], t.label).toBeTruthy();
    // sem foto (slug vazio): aparecem as iniciais ou só o texto
    for (const h of Object.values(SPECTRUM_HISTORY)) for (const f of h.figures.filter((x) => x.slug)) {
      expect(existsSync(join(__dirname, "..", "..", "public", "historia", `${f.slug}.jpg`)), f.slug).toBe(true);
      expect(f.credit.page).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(f.credit.license).toBeTruthy();
    }
  });
});

describe("cada corrente com personagens próprios", () => {
  it("liberalismo social, libertarianismo, liberalismo econômico e conservadorismo não repetem pessoas", () => {
    const names = ["Liberalismo social", "Libertarianismo", "Liberalismo econômico", "Conservadorismo"].flatMap((k) => SPECTRUM_HISTORY[k].figures.map((f) => f.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("cada corrente tem pensador, figura internacional e figura brasileira, nessa ordem", () => {
    for (const [k, h] of Object.entries(SPECTRUM_HISTORY)) expect([...new Set(h.figures.map((f) => f.role))], k).toEqual(["Pensador", "Figura internacional", "Figura brasileira"]);
  });
});
