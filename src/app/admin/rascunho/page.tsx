import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { AdminHero, AdminShell, Panel } from "@/components/admin/AdminUI";
import { ChangePreview } from "@/components/admin/ChangePreview";
import { DraftReview, type DraftItemView } from "@/components/admin/DraftReview";
import { SitePreviewLoader } from "@/components/admin/SitePreviewLoader";
import { previewSamples } from "@/components/admin/preview-samples";
import { getWorkingConfig } from "@/lib/live-config-server";
import { applyScope, contentOf, describeScope, draftItems, scopeId, validateConfig, type Scope } from "@/lib/live-config";
import { buildPublishPlan, numbersFor } from "@/lib/publish-plan";
import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { discardDraftAction } from "../config-actions";

export const metadata: Metadata = { title: "Rascunho", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERR: Record<string, string> = {
  nada: "Marque pelo menos uma mudança.", nome: "Digite seu nome.", motivo: "Escreva o motivo.", invalido: "Há problemas que impedem publicar (veja em vermelho).",
  codigo: "Código do Google Authenticator inválido ou já usado. Espere o próximo código.", bloqueado: "Muitas tentativas erradas de código. Espere 10 minutos.",
};
const PAGES: Record<string, string> = { home: "Página inicial", startCta: "Chamada Começar", footer: "Rodapé", comoFunciona: "Como funciona", metodologia: "Metodologia", report: "Relatório" };
const CONTENT: Record<string, string> = { pages: "Texto", profiles: "Perfil ideológico", history: "Contexto histórico", spectrumIntro: "Introdução do espectro", spectrumSections: "Card de corrente", spectrumComparison: "Comparação prática", candidateViews: "Visão do candidato", candidateProfiles: "Currículo", sources: "Fontes" };

/** Grupo, título legível e cor de cada item do rascunho. */
function label(s: Scope, nums: Record<string, number>, cfg: ReturnType<typeof contentOf>): { group: string; title: string; color: string } {
  switch (s.kind) {
    case "question": return { group: "Perguntas", title: describeScope(s, nums), color: "#2f9a5d" };
    case "calc": case "scores": case "bands": return { group: "Notas e espectro", title: describeScope(s, nums), color: "#6d3fc4" };
    case "ruler": return { group: "Régua", title: "Posições na régua", color: "#ec4899" };
    case "position": case "evidence": return { group: "Posições", title: describeScope(s, nums), color: "#0f766e" };
    case "content": {
      const [top, key] = s.path;
      if (top === "sources") return { group: "Fontes e links", title: key === undefined ? "Lista de fontes" : cfg.sources?.[Number(key)]?.name ?? `Fonte ${Number(key) + 1}`, color: "#0891b2" };
      const sub = top === "pages" ? PAGES[String(key)] ?? String(key) : top === "spectrumSections" ? cfg.spectrumSections[Number(key)]?.title : key === undefined ? "" : String(key);
      return { group: "Textos do site", title: [CONTENT[String(top)] ?? String(top), sub].filter(Boolean).join(" · "), color: "#d4a017" };
    }
    default: return { group: "Mudanças", title: describeScope(s, nums), color: "#6d3fc4" };
  }
}

/** Rascunho: todas as mudanças ainda não publicadas, com antes × depois; publicar as marcadas de uma vez. */
export default async function Page({ searchParams }: { searchParams: Promise<{ erro?: string; descartado?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const w = await getWorkingConfig();
  const live = w.published.cfg;
  const scopes = w.hasDraft ? draftItems(live, w.cfg) : [];
  const nums = numbersFor(live, w.cfg);
  const content = contentOf(w.cfg);
  const items: DraftItemView[] = scopes.map((s) => ({
    id: scopeId(s), scope: s, ...label(s, nums, content),
    preview: <ChangePreview live={live} target={applyScope(live, w.cfg, s)} beforeLabel="No ar" afterLabel="Rascunho" />,
  }));
  const errors = scopes.length ? validateConfig(w.cfg) : [];
  const calc = scopes.some((s) => ["question", "calc", "scores", "bands", "ruler"].includes(s.kind));
  const plan = calc && !errors.length ? await buildPublishPlan(w.cfg, null) : null;

  let preview = null;
  if (calc && !errors.length) {
    const repo = await getContentRepository(), stats = await getStatsRepository();
    const [candidates, positions, evidence, summaries, sources, real] = await Promise.all([
      repo.getCandidates(), repo.getPublishedPositions(), repo.getPublishedEvidence({}), repo.getPublishedProgramSummaries(), repo.getSources(), stats.enabled ? stats.listRecentSubmissions(3) : Promise.resolve([]),
    ]);
    preview = <SitePreviewLoader cfg={w.cfg} live={live} previewKey={`rascunho-${w.published.version}-${items.length}`} liveKey={w.published.key} samples={previewSamples(w.cfg, real)}
      data={{ candidates, positions, evidence, summaries, sources, profiles: content.candidateProfiles }} />;
  }

  return (
    <AdminShell current="/admin/rascunho">
      <AdminHero kicker="Revisar e publicar" title="Rascunho"
        subtitle={items.length ? `${items.length} ${items.length === 1 ? "mudança ainda não está" : "mudanças ainda não estão"} no site. Confira, desmarque o que não quer agora e publique.` : "Nada esperando: tudo que você editou já está no site."} />
      {sp.erro ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c]">{ERR[sp.erro] ?? "Não foi possível publicar."}</p> : null}
      {sp.descartado ? <p className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-strong">Rascunho descartado.</p> : null}

      {items.length ? (
        <>
          {errors.length ? <ul className="list-disc space-y-0.5 rounded-2xl bg-[#fde8e8] p-4 pl-8 text-sm font-semibold text-[#9b1c1c]">{errors.slice(0, 8).map((e) => <li key={e}>{e}</li>)}</ul> : null}
          {plan?.impact?.summary.length ? (
            <Panel title="Impacto nas respostas já enviadas" subtitle="Com todas as mudanças do rascunho" accent="#f97316">
              <ul className="space-y-1 text-sm text-ink-2">{plan.impact.summary.map((t) => <li key={t}>• {t}</li>)}</ul>
            </Panel>
          ) : null}
          {preview ? (
            <details className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5">
              <summary className="cursor-pointer text-sm font-bold text-purple-strong">Ver como fica o relatório (questionários de exemplo)</summary>
              <div className="mt-3">{preview}</div>
            </details>
          ) : null}
          <DraftReview items={items} needsCode={adminTotpSecret() !== null} blocked={errors[0] ?? null} />
          <details className="text-right text-xs">
            <summary className="cursor-pointer list-none font-semibold text-ink-3 underline hover:text-[#9b1c1c]">Descartar todo o rascunho</summary>
            <form action={discardDraftAction} className="mt-2 inline-flex items-center gap-2"><span className="text-ink-2">Tudo volta a ficar igual ao que está no site.</span><button className="rounded-lg bg-[#9b1c1c] px-3 py-1.5 font-bold text-white">Descartar tudo</button></form>
          </details>
        </>
      ) : (
        <p className="rounded-2xl bg-surface p-6 text-sm text-ink-2 shadow-sm ring-1 ring-black/5">Para mudar algo, edite em <Link className="font-semibold text-purple underline" href="/admin/perguntas">Perguntas</Link>, <Link className="font-semibold text-purple underline" href="/admin/notas">Notas e espectro</Link> ou <Link className="font-semibold text-purple underline" href="/admin/textos">Textos do site</Link>. As mudanças aparecem aqui.</p>
      )}
    </AdminShell>
  );
}
