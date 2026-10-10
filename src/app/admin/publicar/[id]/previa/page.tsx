import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { AdminHero, AdminShell, Panel } from "@/components/admin/AdminUI";
import { PublishForm } from "@/components/admin/PublishForm";
import { SitePreviewLoader } from "@/components/admin/SitePreviewLoader";
import { ChangePreview } from "@/components/admin/ChangePreview";

const CALC = ["Notas por alternativa", "Espectro político", "Régua", "Perguntas"];
import { buildPublishPlan } from "@/lib/publish-plan";
import { getPublishedConfig, getRequest } from "@/lib/live-config-server";
import { activeQuestions, applyScope, contentOf, type LiveConfig, type Scope } from "@/lib/live-config";
import { getContentRepository, getStatsRepository } from "@/lib/repository";
import type { SessionState } from "@/store/session";
import type { UserAnswer } from "@/domain/types";

export const metadata: Metadata = { title: "Prévia e confirmação", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const session = (answers: UserAnswer[]): SessionState => ({ version: 1, consent: "declined", consentUpdatedAt: null, answers, priorities: [], candidateOrder: ["lula", "flavio-bolsonaro"], demographics: { ageRange: null, region: null }, completedAt: new Date().toISOString(), submittedAt: null });

/** Questionários de exemplo: três perfis montados (esquerda, centro, direita) e os últimos reais. */
function samples(cfg: LiveConfig, real: { answers: UserAnswer[] }[]) {
  const qs = activeQuestions(cfg);
  const pickBy = (fn: (opts: { id: string }[]) => { id: string }) => qs.map((q) => ({ questionId: q.id, optionIds: [fn(q.options.filter((o) => !o.isNoOpinion)).id] }));
  return [
    { label: "Exemplo: respostas mais à esquerda", session: session(pickBy((o) => o[0])) },
    { label: "Exemplo: respostas ao centro", session: session(pickBy((o) => o[Math.floor((o.length - 1) / 2)])) },
    { label: "Exemplo: respostas mais à direita", session: session(pickBy((o) => o[o.length - 1])) },
    ...real.slice(-3).reverse().map((r, i) => ({ label: `Questionário real recente ${i + 1}`, session: session(r.answers) })),
  ];
}

/** Aceitar: prévia de como o site vai ficar e confirmação (nome, motivo, ciente, frase e código). */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number((await params).id);
  const req = await getRequest(id);
  if (!req) notFound();
  if (req.row.status !== "aberto") redirect(`/admin/publicar/${id}`);
  const pub = await getPublishedConfig(true);
  const scope = req.row.scope as Scope | null;
  const target = scope ? applyScope(pub.cfg, req.cfg, scope) : req.cfg;
  const plan = await buildPublishPlan(target, req.row.rollbackOf);
  const stale = !scope && req.row.baseVersion !== pub.version;
  const repo = await getContentRepository();
  const stats = await getStatsRepository();
  const [candidates, positions, evidence, summaries, sources, real] = await Promise.all([
    repo.getCandidates(), repo.getPublishedPositions(), repo.getPublishedEvidence({}), repo.getPublishedProgramSummaries(), repo.getSources(), stats.enabled ? stats.listRecentSubmissions(3) : Promise.resolve([]),
  ]);
  const calc = plan.sections.some((x) => CALC.includes(x));
  // textos que aparecem dentro do relatório (perfis, mensagens, correntes, visões, currículos)
  const reportText = plan.changes.some((c) => c.section === "Textos do site" && /Perfil|Relatório|Card|Contexto|Visão|Currículo|espectro/i.test(c.text));

  return (
    <AdminShell current="/admin/publicar">
      <AdminHero kicker={`Pedido #${id} · aceitar`} title="Prévia de como o site vai ficar" pdfTitle={`Prévia pedido ${id}`} subtitle={`${req.row.author}: ${req.row.note}. Confira e, se estiver tudo certo, confirme com o código para publicar.`} />
      <Panel title="1. Prévia do que foi editado" subtitle="No ar × com o pedido, só o que mudou" accent="#6d3fc4">
        <ChangePreview live={pub.cfg} target={target} />
        {!calc && !reportText ? null : (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">{calc ? "Como fica o relatório (questionários de exemplo)" : "Como o texto aparece no relatório"}</p>
            <SitePreviewLoader cfg={target} live={pub.cfg} previewKey={`previa-${id}-${pub.version}`} liveKey={pub.key} samples={samples(target, real)}
              data={{ candidates, positions, evidence, summaries, sources, profiles: contentOf(target).candidateProfiles }} />
          </div>
        )}
      </Panel>
      <Panel title="2. Confirmar e publicar" subtitle="Nome, motivo, Estou ciente, frase e código" accent="#2f9a5d">
        {plan.errors.length || stale ? <p className="text-sm font-semibold text-[#9b1c1c]">Não dá para publicar: {stale ? "pedido desatualizado" : plan.errors[0]}</p> : (
          <PublishForm phrase={plan.phrase} requestId={id} rollback={req.row.rollbackOf} needsCode={adminTotpSecret() !== null} danger={(plan.impact?.ideologyChanged ?? 0) > 0} defaultReason={req.row.note} />
        )}
      </Panel>
      <Link href={`/admin/publicar/${id}`} className="text-sm font-semibold text-purple underline">← Voltar ao pedido</Link>
    </AdminShell>
  );
}
