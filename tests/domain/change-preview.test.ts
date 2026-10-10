import { describe, expect, it } from "vitest";
import { BASELINE_CONFIG, contentOf, type LiveConfig } from "@/lib/live-config";
import { contentPairs } from "@/components/admin/ChangePreview";

const clone = (c: LiveConfig): LiveConfig => JSON.parse(JSON.stringify({ ...c, content: contentOf(c) }));

describe("antes × depois", () => {
  it("mostra pergunta, nota, faixa, régua e texto de página", async () => {
    const a = clone(BASELINE_CONFIG), b = clone(BASELINE_CONFIG);
    const q = b.questions.find((x) => x.id === "q01")!;
    q.text = "Texto novo da pergunta";
    const k = Object.keys(b.optionScores).find((x) => x.startsWith("q01|lula|"))!;
    b.optionScores[k] = [b.optionScores[k][0] === 1 ? 0 : 1, "teste"];
    const f = Object.keys(b.spectrumPositions).find((x) => x.startsWith("q01|"))!;
    b.spectrumPositions[f] = [b.spectrumPositions[f][0] === "Direita" ? "Esquerda" : "Direita", "teste"];
    b.rightSideFrom = b.rightSideFrom + 0.1;
    const pages = b.content!.pages as unknown as Record<string, Record<string, unknown>>;
    const field = Object.keys(pages.metodologia).find((x) => typeof pages.metodologia[x] === "string")!;
    pages.metodologia[field] = "Metodologia reescrita";
    const pairs = await contentPairs(a, b);
    const groups = pairs.map((p) => p.group);
    expect(groups).toEqual(expect.arrayContaining(["Perguntas", "Notas", "Faixas na régua", "Régua", "Textos do site"]));
    const page = pairs.find((p) => p.group === "Textos do site")!;
    expect(JSON.stringify(page.after)).toContain("Metodologia reescrita");
    expect(JSON.stringify(page.before)).not.toContain("Metodologia reescrita");
  });

  it("sem mudança, nada para mostrar", async () => {
    expect(await contentPairs(clone(BASELINE_CONFIG), clone(BASELINE_CONFIG))).toEqual([]);
  });
});
