import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { getWorkingConfig } from "@/lib/live-config-server";
import { createSuggestionAction, respondSuggestionAction } from "./actions";
import { SUGGESTION_SECTIONS } from "./sections";
import { CommentThread } from "@/components/admin/CommentThread";

export const metadata: Metadata = { title: "Sugestões de mudança", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  aberta: { label: "Aberta", cls: "bg-gold-soft text-gold-strong ring-gold/40" },
  aceita: { label: "Aceita", cls: "bg-mint-soft text-mint-strong ring-mint/40" },
  recusada: { label: "Recusada", cls: "bg-paper text-ink-3 ring-line" },
};
const EDITOR: Record<string, string> = { "Notas por alternativa": "/admin/notas", "Espectro político": "/admin/notas", "Régua": "/admin/espectro", "Perguntas": "/admin/perguntas" };
const ERRO: Record<string, string> = { "1": "Preencha seu nome e a sugestão.", "2": "Digite seu nome para responder.", recusa: "Para recusar, escreva o motivo da recusa.", comentario: "Para comentar, escreva seu nome e o comentário." };
const input = "mt-1 w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

/** Sugestões: registrar uma ideia de mudança sem mexer no site; depois aceitar ou recusar. */
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; enviada?: string; erro?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const all = await getPrisma().changeSuggestion.findMany({ orderBy: { id: "desc" } });
  const rows = sp.status ? all.filter((s) => s.status === sp.status) : all;
  const comments = await getPrisma().adminComment.findMany({ where: { target: "sugestao" }, orderBy: { id: "asc" } });
  const { cfg } = await getWorkingConfig();
  const qtext = (id: string | null) => (id ? cfg.questions.find((q) => q.id === id)?.text ?? id : null);

  return (
    <AdminShell current="/admin/sugestoes">
      <AdminHero kicker="Ideias" title="Sugestões de mudança" pdfTitle="Sugestões de mudança"
        subtitle="Registre uma ideia de mudança sem alterar o site. Fica guardada com o nome de quem sugeriu, para ser aceita ou recusada depois." />
      {sp.enviada ? <p className="rounded-2xl bg-mint-soft p-4 text-sm font-semibold text-mint-strong">Sugestão registrada.</p> : null}
      {sp.erro ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c]">{ERRO[sp.erro] ?? "Preencha seu nome e a sugestão."}</p> : null}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Sugestões" value={String(all.length)} color="#6d3fc4" />
        <Kpi label="Abertas" value={String(all.filter((s) => s.status === "aberta").length)} color="#d4a017" />
        <Kpi label="Aceitas" value={String(all.filter((s) => s.status === "aceita").length)} color="#2f9a5d" />
        <Kpi label="Recusadas" value={String(all.filter((s) => s.status === "recusada").length)} color="#9ca3af" />
      </section>

      <Panel title="Nova sugestão" subtitle="Não muda nada no site." accent="#6d3fc4">
        <form action={createSuggestionAction} className="grid gap-3 md:grid-cols-2">
          <label className="block text-xs font-semibold text-ink-2">Seu nome *<input name="author" required minLength={2} maxLength={60} className={input} placeholder="Quem está sugerindo" /></label>
          <label className="block text-xs font-semibold text-ink-2">Seção *<select name="section" className={input}>{SUGGESTION_SECTIONS.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-xs font-semibold text-ink-2 md:col-span-2">Pergunta relacionada (opcional)
            <select name="questionId" className={input}><option value="">—</option>{cfg.questions.filter((q) => !cfg.archived.includes(q.id)).map((q) => <option key={q.id} value={q.id}>{q.text.slice(0, 110)}</option>)}</select>
          </label>
          <label className="block text-xs font-semibold text-ink-2 md:col-span-2">O que você sugere *<textarea name="suggestion" required minLength={3} maxLength={2000} rows={3} className={input} placeholder='Ex.: na pergunta do SUS, Flávio deveria ter 0,5 em "Não"' /></label>
          <label className="block text-xs font-semibold text-ink-2 md:col-span-2">Por quê<textarea name="reason" maxLength={1000} rows={2} className={input} /></label>
          <div className="md:col-span-2"><button className="admin-press min-h-10 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2 text-sm font-bold text-white">Registrar sugestão</button></div>
        </form>
      </Panel>

      <div className="flex flex-wrap gap-2">
        {[["", "Todas"], ["aberta", "Abertas"], ["aceita", "Aceitas"], ["recusada", "Recusadas"]].map(([v, l]) => (
          <Link key={v} href={v ? `/admin/sugestoes?status=${v}` : "/admin/sugestoes"} className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${(sp.status ?? "") === v ? "bg-purple text-white ring-purple" : "bg-surface text-ink-2 ring-line"}`}>{l}</Link>
        ))}
      </div>

      <ul className="space-y-3">
        {rows.map((s) => (
          <li key={s.id} id={`s${s.id}`} className="admin-lift overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${STATUS[s.status]?.cls}`}>{STATUS[s.status]?.label ?? s.status}</span>
              <p className="text-sm"><b>{s.author}</b> sugeriu em <b>{s.section}</b></p>
              <span className="ml-auto text-xs text-ink-3">{s.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</span>
            </div>
            <div className="space-y-2 p-4 text-sm">
              {qtext(s.questionId) ? <p className="text-xs text-ink-3">Pergunta: {qtext(s.questionId)}</p> : null}
              <p className="text-ink">{s.suggestion}</p>
              {s.reason ? <p className="text-ink-2"><b>Por quê:</b> {s.reason}</p> : null}
              {s.respondedBy ? <p className={`rounded-lg px-3 py-2 text-xs ring-1 ${s.status === "recusada" ? "bg-[#fde8e8] text-[#7f1d1d] ring-[#f5b5b5]" : "bg-paper/70 text-ink-2 ring-line"}`}><b>{s.status === "recusada" ? "Recusada" : s.status === "aceita" ? "Aceita" : "Reaberta"} por {s.respondedBy}</b> ({s.respondedAt?.toLocaleDateString("pt-BR")}){s.response ? <>{s.status === "recusada" ? " · motivo: " : ": "}{s.response}</> : null}</p> : null}
            </div>
            <div className="border-t border-line px-4 py-3">
              <CommentThread target="sugestao" targetId={s.id} comments={comments.filter((c) => c.targetId === s.id)} />
            </div>
            <form action={respondSuggestionAction} className="flex flex-wrap items-end gap-2 border-t border-line bg-paper/40 px-4 py-3">
              <input type="hidden" name="id" value={s.id} />
              <label className="text-xs font-semibold text-ink-2">Seu nome<input name="respondedBy" required minLength={2} maxLength={60} className={`${input} w-40`} /></label>
              <label className="min-w-48 flex-1 text-xs font-semibold text-ink-2">Comentário (obrigatório para recusar: o motivo)<input name="response" maxLength={1000} className={input} /></label>
              <button name="status" value="aceita" className="min-h-9 rounded-lg bg-mint px-3 py-1.5 text-xs font-bold text-white">Aceitar</button>
              <button name="status" value="recusada" className="min-h-9 rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line">Recusar</button>
              {s.status !== "aberta" ? <button name="status" value="aberta" className="min-h-9 rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-3 ring-1 ring-line">Reabrir</button> : null}
              {EDITOR[s.section] ? <Link href={EDITOR[s.section]} className="min-h-9 rounded-lg bg-purple-soft px-3 py-1.5 text-xs font-bold text-purple-strong">Levar para o rascunho →</Link> : null}
            </form>
          </li>
        ))}
        {!rows.length ? <li className="rounded-2xl bg-surface p-6 text-center text-sm text-ink-3 ring-1 ring-black/5">Nenhuma sugestão.</li> : null}
      </ul>
    </AdminShell>
  );
}
