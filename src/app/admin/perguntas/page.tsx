import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, Panel, QNum, SectionTitle } from "@/components/admin/AdminUI";
import { NewQuestionForm, QuestionEditor } from "@/components/admin/QuestionEditors";
import { getWorkingConfig } from "@/lib/live-config-server";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { TOPICS } from "@/data/topics";
import { SPECTRUM_BANDS } from "@/data/political-spectrum";
import { questionNumbers, scopeChanged } from "@/lib/live-config";
import { DraftTag } from "@/components/admin/DraftTag";

export const metadata: Metadata = { title: "Perguntas", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Perguntas do questionário: editar, acrescentar alternativa, arquivar/restaurar e criar. Tudo vai para o rascunho. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { cfg, published } = await getWorkingConfig();
  const pubIds = new Set(published.cfg.questions.map((q) => q.id));
  const topicOrder = AREA_GROUPS.flatMap((g) => TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order).map((t) => t.id));
  const nums = questionNumbers(cfg, topicOrder);
  const bands = SPECTRUM_BANDS.map((b) => ({ label: b.label, color: b.color }));
  const active = cfg.questions.filter((q) => !cfg.archived.includes(q.id));
  const archived = cfg.questions.filter((q) => cfg.archived.includes(q.id));
  const topics = AREA_GROUPS.flatMap((g) => TOPICS.filter((t) => g.topicIds.includes(t.id)).map((t) => ({ id: t.id, name: t.name, area: g.label })));

  return (
    <AdminShell current="/admin/perguntas">
      <AdminHero kicker="Questionário" title="Perguntas" pdfTitle="Perguntas"
        extra={<a href="/admin/perguntas/pdf" className="inline-flex min-h-10 items-center rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25">Exportar PDF</a>}
        subtitle="Edite textos, acrescente alternativas, arquive ou crie perguntas. Tudo fica no rascunho; ao publicar, a numeração e as contagens do site (perguntas e temas) se ajustam sozinhas." />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="No questionário" value={String(active.length)} note="perguntas ativas no rascunho" color="#6d3fc4" />
        <Kpi label="No ar" value={String(published.cfg.questions.length - published.cfg.archived.length)} note={`versão v${published.version}`} color="#2f9a5d" />
        <Kpi label="Novas no rascunho" value={String(cfg.questions.filter((q) => !pubIds.has(q.id)).length)} color="#f97316" />
        <Kpi label="Arquivadas" value={String(archived.length)} note="respostas antigas guardadas" color="#9ca3af" />
      </section>

      <Panel title="Nova pergunta" subtitle="Precisa de pelo menos 2 alternativas. Cada alternativa já entra com a nota de cada candidato e a faixa na régua." accent="#2f9a5d">
        <NewQuestionForm topics={topics} bands={bands} />
      </Panel>

      {AREA_GROUPS.map((g, gi) => {
        const qs = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order).flatMap((t) => active.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => ({ q, t })));
        return (
          <div key={g.id} className="space-y-3">
            <SectionTitle n={gi + 1} label={g.label} color={g.color} note={`${qs.length} perguntas`} />
            <div className="grid gap-4 xl:grid-cols-2">
              {qs.map(({ q, t }) => (
                <article key={q.id} className="admin-lift min-w-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
                  <div aria-hidden="true" className="h-1" style={{ background: g.color }} />
                  <div className="p-4">
                    <p className="text-sm font-semibold leading-snug text-ink"><QNum n={nums[q.id]} title={`código interno ${q.id}`} />{q.text}{!pubIds.has(q.id) ? <span className="ml-2 rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">nova</span> : null}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-3">{t.name}</p>
                    {q.example ? <p className="mt-2 text-xs leading-relaxed text-ink-2">{q.example}</p> : null}
                    <ul className="mt-2 flex flex-wrap gap-1.5">{q.options.map((o) => <li key={o.id} className={`rounded-full px-2.5 py-0.5 text-xs ${o.isNoOpinion ? "bg-paper text-ink-3" : "bg-purple-soft text-purple-strong"}`}>{o.label}</li>)}</ul>
                    <QuestionEditor id={q.id} text={q.text} example={q.example ?? ""} options={q.options.map((o) => ({ id: o.id, label: o.label, noOpinion: o.isNoOpinion }))} archived={false} bands={bands} isNew={!pubIds.has(q.id)} />
                    <DraftTag scope={{ kind: "question", id: q.id }} changed={scopeChanged(published.cfg, cfg, { kind: "question", id: q.id })} what={pubIds.has(q.id) ? `Pergunta ${nums[q.id]}` : "Pergunta nova"} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}

      {archived.length ? (
        <Panel title="Arquivadas" subtitle="Fora do questionário e da conta. As respostas antigas continuam guardadas.">
          <ul className="space-y-3">{archived.map((q) => (
            <li key={q.id} className="rounded-xl bg-paper/60 p-3 ring-1 ring-line">
              <p className="text-sm text-ink-2">{q.text}</p>
              <QuestionEditor id={q.id} text={q.text} example={q.example ?? ""} options={[]} archived bands={bands} isNew={false} />
              <DraftTag scope={{ kind: "question", id: q.id }} changed={scopeChanged(published.cfg, cfg, { kind: "question", id: q.id })} what="Pergunta arquivada" />
            </li>
          ))}</ul>
        </Panel>
      ) : null}
    </AdminShell>
  );
}
