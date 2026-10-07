import { describe, expect, it } from "vitest";
import { SOURCE_REGISTRY } from "@/data/source-registry";

describe("links das fontes", () => {
  it("não têm rastreamento do ChatGPT nem parâmetros utm", () => {
    const bad = SOURCE_REGISTRY.flatMap((s) => [s.url, s.documentUrl ?? ""]).filter((u) => /chatgpt|utm_/i.test(u));
    expect(bad).toEqual([]);
  });
});
