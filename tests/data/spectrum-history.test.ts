import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SPECTRUM_HISTORY } from "@/data/spectrum-history";
import { SPECTRUM_SECTIONS } from "@/data/spectrum-terms";

describe("Na história (cards do espectro)", () => {
  it("toda seção do espectro tem história, e toda foto existe com crédito", () => {
    for (const s of SPECTRUM_SECTIONS) expect(SPECTRUM_HISTORY[s.id], s.id).toBeTruthy();
    for (const h of Object.values(SPECTRUM_HISTORY)) for (const f of h.figures) {
      expect(existsSync(join(__dirname, "..", "..", "public", "historia", `${f.slug}.jpg`)), f.slug).toBe(true);
      expect(f.credit.page).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(f.credit.license).toBeTruthy();
    }
  });
});
