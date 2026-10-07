import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { CANDIDATES } from "@/data/candidates";
import { SOURCE_BY_ID } from "@/data/source-registry";
import { sourceHref } from "@/components/SourceBits";
import { EVIDENCE_CLASSIFICATION_LABELS } from "@/domain/types";
import { logoutAction } from "../login/actions";
import { AdminNav } from "@/components/AdminNav";
import { publishAllDraftsAction, publishPositionAction, rejectPositionAction, unpublishPositionAction } from "./actions";

export const metadata: Metadata = { title: "Revisão de posições", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const DIRECTION_LABEL: Record<string, string> = {
  SUPPORTS: "Apoia", PARTIALLY_SUPPORTS: "Apoia em parte", NEUTRAL: "Neutro / manter", PARTIALLY_OPPOSES: "Opõe-se em parte", OPPOSES: "Opõe-se", UNCLEAR: "Não documentado",
};
const STATUS_TONE: Record<string, string> = {
  DRAFT: "bg-gold-soft text-gold-strong border-gold/40", PENDING_REVIEW: "bg-gold-soft text-gold-strong border-gold/40", APPROVED: "bg-mint-soft text-mint-strong border-mint/40",
  PUBLISHED: "bg-mint-soft text-mint-strong border-mint/40", REJECTED: "bg-paper text-ink-3 border-line",
};

export default async function AdminPositionsPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const prisma = getPrisma();
  const positions = await prisma.candidatePosition.findMany({ include: { evidences: { include: { evidence: true } } } });
  const byKey = new Map(positions.map((p) => [`${p.questionId}|${p.candidateId}`, p]));
  const counts = positions.reduce<Record<string, number>>((acc, p) => ((acc[p.reviewStatus] = (acc[p.reviewStatus] ?? 0) + 1), acc), {});
  const topics = [...TOPICS].sort((a, b) => a.order - b.order);

  return (
    <div className="container-page py-12 space-y-10">
      <AdminNav current="/admin/posicoes" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle eyebrow="Admin" tone="gold" lead="Cada posição mostra a direção, a alternativa mais próxima, o resumo e as evidências com trecho e link. Publique uma a uma ou todas de uma vez. Só o que está publicado entra no relatório.">
          Revisão de posições por pergunta
        </PageTitle>
        <form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form>
      </div>

      <section className="card p-5 flex flex-wrap items-center gap-4 text-sm">
        <p><strong>{positions.length}</strong> posições · rascunho {counts.DRAFT ?? 0} · publicadas {counts.PUBLISHED ?? 0} · rejeitadas {counts.REJECTED ?? 0}</p>
        <form action={publishAllDraftsAction} className="ml-auto flex flex-wrap items-center gap-2">
          <label className="text-xs text-ink-3">Digite PUBLICAR para publicar todos os rascunhos
            <input name="confirm" className="field ml-2 w-36" placeholder="PUBLICAR" />
          </label>
          <button className="rounded-lg bg-gradient-to-br from-purple to-purple-strong px-4 py-2 text-sm font-semibold text-white min-h-11">Publicar todos os rascunhos</button>
        </form>
      </section>

      {topics.map((t) => (
        <section key={t.id} className="space-y-4" aria-labelledby={`t-${t.id}`}>
          <h2 id={`t-${t.id}`} className="text-xl font-bold border-l-4 border-purple pl-3">{t.name}</h2>
          {QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => (
            <div key={q.id} className="card p-5 space-y-4">
              <p className="font-semibold"><span className="text-xs text-ink-3 mr-2">{q.id.toUpperCase()}</span>{q.text}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {CANDIDATES.map((c) => {
                  const p = byKey.get(`${q.id}|${c.id}`);
                  if (!p) return <div key={c.id} className="rounded-xl border border-dashed border-line p-4 text-sm text-ink-3">{c.name}: sem posição cadastrada.</div>;
                  const closest = q.options.find((o) => o.id === p.closestOptionId);
                  return (
                    <div key={c.id} className="rounded-xl border border-line p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{c.name}</span>
                        <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[p.reviewStatus]}`}>{p.reviewStatus}</span>
                        <span className="rounded-md border border-purple/30 bg-purple-soft px-2 py-0.5 text-xs font-medium text-purple-strong">{DIRECTION_LABEL[p.direction]}</span>
                        {closest ? <span className="text-xs text-ink-3">mais próxima: “{closest.label}”</span> : null}
                      </div>
                      <p className="text-sm text-ink-2">{p.summary}</p>
                      <ul className="space-y-2">
                        {p.evidences.map(({ evidence: e }) => {
                          const src = SOURCE_BY_ID[e.sourceId];
                          const link = e.summary.match(/Documento: (\S+)/)?.[1] ?? (src ? sourceHref(src) : undefined);
                          return (
                            <li key={e.id} className="rounded-lg border border-line bg-paper/60 p-3 text-xs">
                              <p className="font-semibold">{EVIDENCE_CLASSIFICATION_LABELS[e.classification].label} · nível {e.evidenceStrength} · {e.title}</p>
                              <p className="mt-1 text-ink-2">{e.summary.replace(/ Documento: \S+$/, "")}</p>
                              <p className="mt-1 text-ink-2"><q>{e.originalExcerpt}</q></p>
                              <p className="mt-1 text-ink-3">{src?.institution ?? e.sourceId}{link ? <> · <a className="text-accent underline" href={link} target="_blank" rel="noopener noreferrer">abrir documento</a></> : null}</p>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {p.reviewStatus !== "PUBLISHED" ? (
                          <form action={publishPositionAction}><input type="hidden" name="id" value={p.id} /><button className="rounded-lg bg-mint px-3 py-1.5 text-xs font-semibold text-white min-h-9">Publicar</button></form>
                        ) : (
                          <form action={unpublishPositionAction}><input type="hidden" name="id" value={p.id} /><button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold min-h-9">Despublicar</button></form>
                        )}
                        {p.reviewStatus !== "REJECTED" ? (
                          <form action={rejectPositionAction}><input type="hidden" name="id" value={p.id} /><button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 min-h-9">Rejeitar</button></form>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
