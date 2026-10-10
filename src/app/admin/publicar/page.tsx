import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { buildDraftPlan } from "@/lib/publish-plan";
import { getPublishedConfig, listRequests } from "@/lib/live-config-server";
import { discardDraftAction } from "../config-actions";
import { submitDraftAction } from "./actions";

export const metadata: Metadata = { title: "Publicar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export const SECTION_COLOR: Record<string, string> = { "Notas por alternativa": "#6d3fc4", "Espectro político": "#2563eb", "Régua": "#ec4899", "Perguntas": "#2f9a5d", "Textos do site": "#d4a017", "Revisão de posições": "#0f766e", "Fontes e links": "#0891b2" };
const ERR: Record<string, string> = { envio: "Preencha seu nome e a descrição.", "sem-mudancas": "Não há mudanças no rascunho." };
const when = (d: Date) => d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const input = "mt-1 w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

/** Publicar: enviar o rascunho para aprovação e revisar os pedidos (como pull requests). */
export default async function Page({ searchParams }: { searchParams: Promise<{ erro?: string; fechado?: string; reaberto?: string; descartado?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const [draft, requests, pub] = await Promise.all([buildDraftPlan(), listRequests(), getPublishedConfig(true)]);
  const open = requests.filter((r) => r.status === "aberto");
  const closed = requests.filter((r) => r.status !== "aberto");
  const STATUS: Record<string, string> = { aprovado: "bg-mint text-white", recusado: "bg-[#9b1c1c] text-white", cancelado: "bg-line text-ink-2" };

  return (
    <AdminShell current="/admin/publicar">
      <AdminHero kicker="Aprovação" title="Publicar" pdfTitle="Publicar"
        subtitle="Como no GitHub: quem edita envia o rascunho para aprovação; quem revisa abre o pedido, vê o que muda e o impacto, e aprova (vai para o site) ou recusa." />
      {sp.erro ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c]">{ERR[sp.erro] ?? "Não foi possível enviar."}</p> : null}
      {sp.fechado ? <p className="rounded-2xl bg-paper p-4 text-sm font-semibold text-ink-2 ring-1 ring-line">Pedido #{sp.fechado} fechado.</p> : null}
      {sp.reaberto ? <p className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-strong">As mudanças do pedido voltaram para o rascunho.</p> : null}
      {sp.descartado ? <p className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-strong">Rascunho descartado.</p> : null}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="No rascunho" value={String(draft.changes.length)} note="mudanças ainda não enviadas" color="#f97316" />
        <Kpi label="Aguardando aprovação" value={String(open.length)} color="#6d3fc4" />
        <Kpi label="Aprovados" value={String(closed.filter((r) => r.status === "aprovado").length)} color="#2f9a5d" />
        <Kpi label="Versão no ar" value={`v${pub.version}`} color="#2563eb" />
      </section>

      <Panel title="1. Seu rascunho" subtitle="O que você mudou e ainda não enviou" accent="#f97316">
        {draft.changes.length ? (
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <ul className="max-h-80 space-y-1.5 overflow-y-auto text-sm">
              {draft.changes.map((c, i) => (
                <li key={i} className="flex gap-2 rounded-lg bg-paper/60 px-3 py-2 ring-1 ring-line">
                  <span className="mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: SECTION_COLOR[c.section] }}>{c.section}</span>
                  <span className="text-ink-2">{c.text}</span>
                </li>
              ))}
            </ul>
            <form action={submitDraftAction} className="space-y-3 rounded-xl bg-paper/60 p-4 ring-1 ring-line">
              {draft.errors.length ? <p className="rounded-lg bg-[#fde8e8] p-2 text-xs font-semibold text-[#9b1c1c]">Atenção: {draft.errors.length} problema(s) impedem aprovar ({draft.errors[0]}). Dá para enviar, mas só será aprovado depois de corrigir.</p> : null}
              <label className="block text-xs font-semibold text-ink-2">Seu nome *<input name="author" required minLength={2} maxLength={60} className={input} /></label>
              <label className="block text-xs font-semibold text-ink-2">Descrição das mudanças *<textarea name="note" required minLength={3} maxLength={600} rows={3} className={input} placeholder="Ex.: ajuste das notas de segurança conforme revisão" /></label>
              <button className="admin-press min-h-10 w-full rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2 text-sm font-bold text-white shadow-sm">Enviar para publicação</button>
            </form>
          </div>
        ) : <p className="text-sm text-ink-3">Nada no rascunho. Mude algo em Notas, Espectro, Perguntas, Posições, Textos ou Fontes.</p>}
        {draft.changes.length ? <form action={discardDraftAction} className="mt-3 text-right"><button className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-[#9b1c1c] ring-1 ring-[#f5b5b5]">Excluir rascunho (tudo que ainda não foi enviado)</button></form> : null}
      </Panel>

      <Panel title="2. Aguardando aprovação" subtitle="Abra um pedido para revisar e aprovar ou recusar" accent="#6d3fc4">
        {open.length ? (
          <ul className="space-y-2">
            {open.map((r) => {
              const stale = r.baseVersion !== pub.version;
              return (
                <li key={r.id}>
                  <Link href={`/admin/publicar/${r.id}`} className="flex flex-wrap items-center gap-3 rounded-xl bg-paper/60 px-4 py-3 ring-1 ring-line hover:bg-purple-soft/40">
                    <span className="rounded-lg bg-ink px-2 py-0.5 text-xs font-bold text-white">#{r.id}</span>
                    <span className="min-w-0 flex-1 text-sm"><b>{r.author}</b>: {r.note} <span className="text-ink-3">· {r.changes.length} mudanças{r.rollbackOf ? ` · volta para v${r.rollbackOf}` : ""}</span></span>
                    {stale ? <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[11px] font-bold text-[#9b1c1c]">desatualizado</span> : <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-bold text-gold-strong">aguardando</span>}
                    <span className="text-xs text-ink-3">{when(r.createdAt)}</span>
                    <span className="text-sm font-bold text-purple-strong">Revisar →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-ink-3">Nenhum pedido aguardando.</p>}
      </Panel>

      {closed.length ? (
        <Panel title="Pedidos fechados">
          <ul className="space-y-1.5 text-sm">
            {closed.slice(0, 30).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-line">
                <span className="rounded bg-ink px-1.5 text-xs font-bold text-white">#{r.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS[r.status] ?? ""}`}>{r.status}{r.publishedVersion ? ` · v${r.publishedVersion}` : ""}</span>
                <span className="min-w-0 flex-1 text-ink-2"><b>{r.author}</b>: {r.note}</span>
                {r.reviewedBy ? <span className="text-xs text-ink-3">por {r.reviewedBy}{r.reviewNote ? ` (“${r.reviewNote}”)` : ""}</span> : null}
                <Link href={`/admin/publicar/${r.id}`} className="text-xs font-semibold text-purple underline">ver</Link>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </AdminShell>
  );
}
