import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { FORBIDDEN_PHRASES } from "@/domain/neutrality";

/**
 * Varre o código-fonte procurando qualquer lógica ou texto que possa produzir
 * ranking, recomendação ou vencedor político.
 */
const ROOT = join(__dirname, "..", "..", "src");
const ALLOW = new Set(["domain/neutrality.ts", "domain/publication.ts"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

const FORBIDDEN_IDENTIFIERS = [
  /\bwinner\b/i, /\bbestCandidate\b/i, /\brecommendedCandidate\b/i, /\bcandidatoVencedor\b/i, /\bmelhorCandidato\b/i,
  /\belectoralScore\b/i, /\bpontuacaoEleitoral\b/i, /\bcompatibilityScore\b/i, /\bmatchPercent/i, /\baffinityScore\b/i, /\bvoteIntention\b/i, /\bintencaoDeVoto\b/i,
];

describe("varredura de neutralidade do código", () => {
  const files = walk(ROOT).map((p) => ({ path: relative(ROOT, p), text: readFileSync(p, "utf8") }));
  it("encontra arquivos para analisar", () => expect(files.length).toBeGreaterThan(20));

  it("nenhum arquivo contém frases proibidas de recomendação", () => {
    const offenders: string[] = [];
    for (const f of files) {
      if (ALLOW.has(f.path)) continue;
      const lower = f.text.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        // Permite menções negadas em texto explicativo ("não calcula “melhor candidato”").
        const idx = lower.indexOf(phrase);
        if (idx === -1) continue;
        const before = lower.slice(Math.max(0, idx - 80), idx);
        const negated = /(não|nunca|nem|sem|jamais|nenhum|nenhuma|proibid)[^.]*$/.test(before);
        if (!negated) offenders.push(`${f.path}: "${phrase}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("nenhum identificador de ranking/vencedor/recomendação no código", () => {
    const offenders: string[] = [];
    for (const f of files) for (const re of FORBIDDEN_IDENTIFIERS) if (re.test(f.text)) offenders.push(`${f.path}: ${re}`);
    expect(offenders).toEqual([]);
  });

  it("a importância dos temas nunca multiplica posições de candidatos", () => {
    const suspicious = files.filter((f) => /level\s*\*\s*(direction|position|candidate)/i.test(f.text) || /priority\w*\s*\*\s*(direction|position|candidate)/i.test(f.text));
    expect(suspicious.map((f) => f.path)).toEqual([]);
  });
});
