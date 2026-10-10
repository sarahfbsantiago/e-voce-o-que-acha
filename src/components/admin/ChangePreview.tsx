import { contentOf, sameJson, type LiveConfig } from "@/lib/live-config";
import { getPrisma } from "@/lib/prisma";
import { dataSourceMode } from "@/lib/env";
import { evidenceSummaryWith, type PositionOverride } from "@/data/position-overrides";

type Pair = { title: string; group: string; before: unknown; after: unknown };

const LABEL: Record<string, string> = {
  headline: "Título", card1Title: "Cartão 1 · título", card1Text: "Cartão 1 · texto", card2Title: "Cartão 2 · título", card2Text: "Cartão 2 · texto", notice: "Aviso",
  titleHome: "Título (início)", titleOther: "Título (outras)", subtitle: "Subtítulo", about: "Sobre", bottom: "Linha final", lead: "Introdução", title: "Título", text: "Texto",
  finalMessage: "Mensagem final", footerIntro: "Rodapé", heading: "Título", summary: "Resumo", economy: "Na economia", society: "Na sociedade", state: "O papel do Estado",
  futureLabel: "Rótulo do futuro", future: "O futuro", keywords: "Palavras-chave", name: "Nome", years: "Anos", caption: "Legenda", institution: "Instituição", url: "Link",
  documentUrl: "Link do documento", purpose: "Para que serve", direction: "Direção", reviewStatus: "Status", closestOptionId: "Alternativa mais próxima",
  originalExcerpt: "Trecho original", link: "Link", items: "Itens", steps: "Passos", chapters: "Capítulos", timeline: "Linha do tempo", figures: "Personagens",
};
const DIR: Record<string, string> = { SUPPORTS: "Apoia", PARTIALLY_SUPPORTS: "Apoia em parte", NEUTRAL: "Neutro", PARTIALLY_OPPOSES: "Opõe-se em parte", OPPOSES: "Opõe-se", UNCLEAR: "Não documentado" };
const STATUS: Record<string, string> = { PUBLISHED: "Publicada", DRAFT: "Rascunho", REJECTED: "Rejeitada", PENDING_REVIEW: "Em revisão", APPROVED: "Aprovada" };

/** Achata um objeto em linhas "caminho → texto" para comparar campo a campo. */
function flatten(v: unknown, path: string[] = [], out: [string, string][] = []): [string, string][] {
  if (v === null || v === undefined) return out;
  if (typeof v !== "object") { out.push([path.join(" › "), String(v)]); return out; }
  if (Array.isArray(v)) { v.forEach((x, i) => flatten(x, [...path, `#${i + 1}`], out)); return out; }
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    if (k === "t" || k === "candidateId" || k === "slug" || k === "id") continue;
    flatten(x, [...path, LABEL[k] ?? k], out);
  }
  return out;
}
const nice = (k: string, v: string) => (k.endsWith("Direção") ? DIR[v] ?? v : k.endsWith("Status") ? STATUS[v] ?? v : v);

/** Pares antes × depois de tudo que é texto, posição ou fonte. */
async function contentPairs(a: LiveConfig, b: LiveConfig): Promise<Pair[]> {
  const A = contentOf(a), B = contentOf(b);
  const out: Pair[] = [];
  const PAGES: Record<string, string> = { home: "Página inicial", startCta: "Chamada Começar", footer: "Rodapé", comoFunciona: "Como funciona", metodologia: "Metodologia", report: "Relatório" };
  for (const k of Object.keys(B.pages)) { const x = (A.pages as unknown as Record<string, unknown>)[k], y = (B.pages as unknown as Record<string, unknown>)[k]; if (!sameJson(x, y)) out.push({ group: "Textos do site", title: PAGES[k] ?? k, before: x, after: y }); }
  for (const k of new Set([...Object.keys(A.profiles), ...Object.keys(B.profiles)])) if (!sameJson(A.profiles[k], B.profiles[k])) out.push({ group: "Perfis ideológicos", title: k, before: A.profiles[k], after: B.profiles[k] });
  if (!sameJson(A.spectrumIntro, B.spectrumIntro)) out.push({ group: "Correntes", title: "Introdução do espectro", before: A.spectrumIntro, after: B.spectrumIntro });
  if (!sameJson(A.spectrumComparison, B.spectrumComparison)) out.push({ group: "Correntes", title: "Comparação prática", before: A.spectrumComparison, after: B.spectrumComparison });
  for (const s of B.spectrumSections) { const o = A.spectrumSections.find((x) => x.id === s.id); if (!sameJson(o, s)) out.push({ group: "Correntes", title: s.title, before: o, after: s }); }
  for (const k of new Set([...Object.keys(A.history), ...Object.keys(B.history)])) if (!sameJson(A.history[k], B.history[k])) out.push({ group: "Contexto histórico", title: k, before: A.history[k], after: B.history[k] });
  for (const v of B.candidateViews) { const o = A.candidateViews.find((x) => x.candidateId === v.candidateId); if (!sameJson(o, v)) out.push({ group: "Visão dos candidatos", title: `Visão ${v.candidateId === "lula" ? "Lula" : "Flávio"}`, before: o, after: v }); }
  for (const p of B.candidateProfiles) { const o = A.candidateProfiles.find((x) => x.candidateId === p.candidateId); if (!sameJson(o, p)) out.push({ group: "Currículos", title: p.candidateId === "lula" ? "Lula" : "Flávio Bolsonaro", before: o, after: p }); }
  for (const s of B.sources ?? []) { const o = (A.sources ?? []).find((x) => x.id === s.id); if (!sameJson(o, s)) out.push({ group: "Fontes e links", title: s.name, before: o ?? null, after: s }); }
  for (const s of A.sources ?? []) if (!(B.sources ?? []).some((x) => x.id === s.id)) out.push({ group: "Fontes e links", title: `${s.name} (removida)`, before: s, after: null });

  // posições e evidências: "no ar" = banco + ajustes publicados
  const posKeys = [...new Set([...Object.keys(A.positions ?? {}), ...Object.keys(B.positions ?? {})])].filter((k) => !sameJson(A.positions?.[k], B.positions?.[k]));
  const evIds = [...new Set([...Object.keys(A.evidence ?? {}), ...Object.keys(B.evidence ?? {})])].filter((k) => !sameJson(A.evidence?.[k], B.evidence?.[k]));
  if ((posKeys.length || evIds.length) && dataSourceMode() === "prisma") {
    const prisma = getPrisma();
    for (const key of posKeys) {
      const [questionId, candidateId] = key.split("|");
      const row = await prisma.candidatePosition.findFirst({ where: { questionId, candidateId } });
      if (!row) continue;
      const q = b.questions.find((x) => x.id === questionId);
      const opt = (id: string | null | undefined) => q?.options.find((o) => o.id === id)?.label ?? "—";
      const view = (o: PositionOverride | undefined) => ({ reviewStatus: o?.reviewStatus ?? row.reviewStatus, direction: o?.direction ?? row.direction, closestOptionId: opt(o && o.closestOptionId !== undefined ? o.closestOptionId : row.closestOptionId), summary: o?.summary ?? row.summary });
      out.push({ group: "Revisão de posições", title: `${candidateId === "lula" ? "Lula" : "Flávio"} · ${q?.text ?? questionId}`, before: view(A.positions?.[key]), after: view(B.positions?.[key]) });
    }
    for (const id of evIds) {
      const e = await prisma.evidence.findUnique({ where: { id } });
      if (!e) continue;
      const view = (o: (typeof A.evidence)[string] | undefined) => { const sum = evidenceSummaryWith(e.summary, o); return { title: o?.title ?? e.title, summary: sum.replace(/ Documento: \S+$/, ""), originalExcerpt: o?.originalExcerpt ?? e.originalExcerpt, link: sum.match(/Documento: (\S+)/)?.[1] ?? "" }; };
      out.push({ group: "Revisão de posições", title: `Evidência: ${e.title}`, before: view(A.evidence?.[id]), after: view(B.evidence?.[id]) });
    }
  }
  return out;
}

/** Prévia do que muda em textos, posições e fontes: antes × depois, só os campos alterados. */
export async function ChangePreview({ live, target }: { live: LiveConfig; target: LiveConfig }) {
  const pairs = await contentPairs(live, target);
  if (!pairs.length) return null;
  return (
    <div className="space-y-3">
      {pairs.map((p, i) => {
        const before = new Map(flatten(p.before)), after = new Map(flatten(p.after));
        const keys = [...new Set([...before.keys(), ...after.keys()])].filter((k) => before.get(k) !== after.get(k));
        return (
          <article key={i} className="overflow-hidden rounded-xl bg-surface ring-1 ring-line">
            <p className="flex flex-wrap items-center gap-2 border-b border-line bg-paper/60 px-3 py-2 text-sm"><span className="rounded-full bg-purple px-2 py-0.5 text-[10px] font-bold text-white">{p.group}</span><b className="text-ink">{p.title}</b><span className="ml-auto text-xs text-ink-3">{keys.length} {keys.length === 1 ? "campo alterado" : "campos alterados"}</span></p>
            <div className="divide-y divide-line">
              {keys.slice(0, 40).map((k) => (
                <div key={k} className="grid gap-2 p-3 md:grid-cols-[180px_1fr_1fr]">
                  <p className="text-xs font-bold text-ink-3">{k || "Valor"}</p>
                  <div className="rounded-lg bg-[#fde8e8] p-2 text-sm text-[#7f1d1d]"><p className="text-[10px] font-bold uppercase tracking-wide opacity-70">No ar</p>{before.has(k) ? <p className="line-through decoration-[#dc2626]/60">{nice(k, before.get(k)!)}</p> : <p className="italic opacity-70">(não existe)</p>}</div>
                  <div className="rounded-lg bg-mint-soft p-2 text-sm text-[#14532d]"><p className="text-[10px] font-bold uppercase tracking-wide opacity-70">Com o pedido</p>{after.has(k) ? <p className="font-medium">{nice(k, after.get(k)!)}</p> : <p className="italic opacity-70">(removido)</p>}</div>
                </div>
              ))}
              {keys.length > 40 ? <p className="p-3 text-xs text-ink-3">+{keys.length - 40} campos</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
