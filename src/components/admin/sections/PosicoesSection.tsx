import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { QUESTIONS } from "@/data/questions";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { TOPICS } from "@/data/topics";
import { CANDIDATES } from "@/data/candidates";
import { SOURCE_BY_ID } from "@/data/source-registry";
import { sourceHref } from "@/components/SourceBits";
import { EVIDENCE_CLASSIFICATION_LABELS } from "@/domain/types";
import { AdminHero, Kpi, QNum, SectionTitle } from "@/components/admin/AdminUI";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { publishAllDraftsAction, publishPositionAction, rejectPositionAction, unpublishPositionAction } from "@/app/admin/posicoes/actions";


const DIRECTION_LABEL: Record<string, string> = {
  SUPPORTS: "Apoia", PARTIALLY_SUPPORTS: "Apoia em parte", NEUTRAL: "Neutro / manter", PARTIALLY_OPPOSES: "Opõe-se em parte", OPPOSES: "Opõe-se", UNCLEAR: "Não documentado",
};
const STATUS_LABEL: Record<string, string> = { DRAFT: "Rascunho", PENDING_REVIEW: "Em revisão", APPROVED: "Aprovada", PUBLISHED: "Publicada", REJECTED: "Rejeitada" };
const CAND_COLOR: Record<string, string> = { lula: "#6d3fc4", "flavio-bolsonaro": "#2f9a5d" };
const STATUS_TONE: Record<string, string> = {
  DRAFT: "bg-gold-soft text-gold-strong border-gold/40", PENDING_REVIEW: "bg-gold-soft text-gold-strong border-gold/40", APPROVED: "bg-mint-soft text-mint-strong border-mint/40",
  PUBLISHED: "bg-mint-soft text-mint-strong border-mint/40", REJECTED: "bg-paper text-ink-3 border-line",
};

export async function PosicoesSection() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const prisma = getPrisma();
  const positions = await prisma.candidatePosition.findMany({ include: { evidences: { include: { evidence: true } } } });
  const current = new Set(QUESTIONS.map((q) => q.id));
  const live = positions.filter((p) => current.has(p.questionId));
  const byKey = new Map(live.map((p) => [`${p.questionId}|${p.candidateId}`, p]));
  const counts = live.reduce<Record<string, number>>((acc, p) => ((acc[p.reviewStatus] = (acc[p.reviewStatus] ?? 0) + 1), acc), {});
  const missing = QUESTIONS.length * CANDIDATES.length - live.length;

  return (
    <>
      <AdminHero kicker="Curadoria" title="Revisão de posições" pdfTitle="Revisão de posições"
        subtitle="A posição documentada de cada candidato em cada pergunta, com as evidências. Só o que está publicado entra no relatório." />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Posições" value={String(live.length)} note={`nas ${QUESTIONS.length} perguntas atuais`} color="#6d3fc4" />
        <Kpi label="Publicadas" value={String(counts.PUBLISHED ?? 0)} note="entram no relatório" color="#2f9a5d" />
        <Kpi label="Rascunhos" value={String((counts.DRAFT ?? 0) + (counts.PENDING_REVIEW ?? 0))} note="aguardando revisão" color="#d4a017" />
        <Kpi label="Rejeitadas" value={String(counts.REJECTED ?? 0)} color="#9ca3af" />
        <Kpi label="Sem posição" value={String(missing)} note="as notas por alternativa valem mesmo assim" color="#ec4899" />
      </section>

      <form action={publishAllDraftsAction} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5 print:hidden">
        <p className="text-sm font-semibold text-ink">Publicar todos os rascunhos de uma vez</p>
        <label className="ml-auto flex items-center gap-2 text-xs text-ink-3">Digite PUBLICAR para confirmar
          <input name="confirm" className="field w-36" placeholder="PUBLICAR" />
        </label>
        <button className="min-h-10 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm">Publicar todos</button>
      </form>

      {AREA_GROUPS.map((g, gi) => {
        const qs = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order).flatMap((t) => QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => ({ q, t })));
        return (
          <div key={g.id} className="space-y-3">
            <SectionTitle n={gi + 1} label={g.label} color={g.color} note={`${qs.length} perguntas`} />
            {qs.map(({ q, t }) => (
              <article key={q.id} className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 print:break-inside-avoid print:border print:border-line">
                <div aria-hidden="true" className="h-1" style={{ background: g.color }} />
                <div className="p-4 md:p-5">
                  <p className="text-sm font-semibold leading-snug text-ink"><QNum n={QUESTION_NUMBER[q.id]} title={`código interno ${q.id}`} />{q.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-3">{t.name}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {CANDIDATES.map((c) => {
                      const p = byKey.get(`${q.id}|${c.id}`);
                      if (!p) return (
                        <div key={c.id} className="rounded-xl border-2 border-dashed border-line p-4 text-sm text-ink-3">
                          <p className="flex items-center gap-2 font-semibold text-ink-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: CAND_COLOR[c.id] }} />{c.name}</p>
                          <p className="mt-1">Sem posição cadastrada.</p>
                        </div>
                      );
                      const closest = q.options.find((o) => o.id === p.closestOptionId);
                      return (
                        <div key={c.id} className="space-y-3 rounded-xl bg-paper/60 p-4 ring-1 ring-line" style={{ borderLeft: `4px solid ${CAND_COLOR[c.id]}` }}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-ink">{c.name}</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_TONE[p.reviewStatus]}`}>{STATUS_LABEL[p.reviewStatus] ?? p.reviewStatus}</span>
                            <span className="rounded-full bg-purple-soft px-2.5 py-0.5 text-[11px] font-bold text-purple-strong">{DIRECTION_LABEL[p.direction]}</span>
                          </div>
                          {closest ? <p className="text-xs text-ink-2"><span className="font-semibold text-ink">Alternativa mais próxima:</span> {closest.label}</p> : null}
                          <p className="text-sm leading-relaxed text-ink-2">{p.summary}</p>
                          {p.evidences.length ? (
                            <details className="rounded-lg bg-surface ring-1 ring-line">
                              <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-purple-strong">{p.evidences.length} evidência{p.evidences.length > 1 ? "s" : ""}</summary>
                              <ul className="space-y-2 px-3 pb-3">
                                {p.evidences.map(({ evidence: e }) => {
                                  const src = SOURCE_BY_ID[e.sourceId];
                                  const link = e.summary.match(/Documento: (\S+)/)?.[1] ?? (src ? sourceHref(src) : undefined);
                                  return (
                                    <li key={e.id} className="rounded-lg bg-paper/70 p-3 text-xs">
                                      <p className="font-semibold text-ink">{EVIDENCE_CLASSIFICATION_LABELS[e.classification].label} · nível {e.evidenceStrength} · {e.title}</p>
                                      <p className="mt-1 text-ink-2">{e.summary.replace(/ Documento: \S+$/, "")}</p>
                                      <p className="mt-1 italic text-ink-2"><q>{e.originalExcerpt}</q></p>
                                      <p className="mt-1 text-ink-3">{src?.institution ?? e.sourceId}{link ? <> · <a className="font-semibold text-purple underline" href={link} target="_blank" rel="noopener noreferrer">abrir documento ↗</a></> : null}</p>
                                    </li>
                                  );
                                })}
                              </ul>
                            </details>
                          ) : null}
                          <div className="flex flex-wrap gap-2 print:hidden">
                            {p.reviewStatus !== "PUBLISHED" ? (
                              <form action={publishPositionAction}><input type="hidden" name="id" value={p.id} /><button className="min-h-9 rounded-lg bg-mint px-3 py-1.5 text-xs font-bold text-white shadow-sm">Publicar</button></form>
                            ) : (
                              <form action={unpublishPositionAction}><input type="hidden" name="id" value={p.id} /><button className="min-h-9 rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line">Despublicar</button></form>
                            )}
                            {p.reviewStatus !== "REJECTED" ? (
                              <form action={rejectPositionAction}><input type="hidden" name="id" value={p.id} /><button className="min-h-9 rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-3 ring-1 ring-line">Rejeitar</button></form>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        );
      })}
    </>
  );
}
