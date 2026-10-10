import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { MiniRuler } from "@/components/admin/MiniRuler";
import { ChangePreview } from "@/components/admin/ChangePreview";

const CALC = ["Notas por alternativa", "Espectro político", "Régua", "Perguntas"];
import { buildPublishPlan } from "@/lib/publish-plan";
import { getPublishedConfig, getRequest } from "@/lib/live-config-server";
import { CANDIDATE_SHORT, applyScope, describeScope, type Scope } from "@/lib/live-config";
import { rejectAction, reopenAction } from "../actions";
import { SECTION_COLOR } from "../page";
import { CommentThread } from "@/components/admin/CommentThread";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Revisar pedido", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  bloqueado: "Muitas tentativas erradas de código. Espere 10 minutos.", fechado: "Este pedido já foi fechado.",
  desatualizado: "A versão no ar mudou depois deste pedido. Recuse, leve ao rascunho e reenvie.", "sem-mudancas": "Este pedido não muda nada em relação ao que está no ar.",
  invalido: "Há problemas que impedem publicar (veja em vermelho).", nome: "Digite seu nome.", motivo: "Escreva o motivo.", ciente: "Marque \"Estou ciente\".",
  frase: "A frase digitada não confere.", codigo: "Código do Google Authenticator inválido ou já usado.", "nome-recusa": "Digite seu nome para recusar.", "motivo-recusa": "Para recusar, escreva o motivo da recusa.", comentario: "Para comentar, escreva seu nome e o comentário.",
};
const pct = (n: number | null) => (n === null ? "—" : `${String(n).replace(".", ",")}%`);
const input = "mt-1 w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm";

/** Revisão de um pedido de publicação: o que muda, impacto, pré-visualização; aprovar ou recusar. */
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string; enviado?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number((await params).id);
  const sp = await searchParams;
  const req = await getRequest(id);
  if (!req) notFound();
  const pub = await getPublishedConfig(true);
  const scope = req.row.scope as Scope | null;
  const plan = await buildPublishPlan(scope ? applyScope(pub.cfg, req.cfg, scope) : req.cfg, req.row.rollbackOf);
  const im = plan.impact;
  const isOpen = req.row.status === "aberto";
  const comments = await getPrisma().adminComment.findMany({ where: { target: "pedido", targetId: id }, orderBy: { id: "asc" } });
  const stale = isOpen && !scope && req.row.baseVersion !== pub.version;

  return (
    <AdminShell current="/admin/publicar">
      <AdminHero kicker={`Pedido #${id} · ${req.row.status}`} title={req.row.rollbackOf ? `Voltar para a versão v${req.row.rollbackOf}` : "Revisar pedido de publicação"} pdfTitle={`Pedido ${id}`}
        subtitle={`${scope ? `${describeScope(scope)} · ` : ""}${req.row.author}: ${req.row.note} · enviado em ${req.row.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}, sobre a v${req.row.baseVersion}`} />
      {sp.enviado ? <p className="rounded-2xl bg-mint-soft p-4 text-sm font-semibold text-mint-strong">Enviado para aprovação. Agora é só alguém revisar e aprovar aqui.</p> : null}
      {sp.erro ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c]">{ERRORS[sp.erro] ?? "Não foi possível."}</p> : null}
      {stale ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c]">Desatualizado: a versão no ar mudou (v{req.row.baseVersion} → v{pub.version}). Recuse, leve ao rascunho e reenvie.</p> : null}
      {!isOpen ? <p className={`rounded-2xl p-4 text-sm ring-1 ${req.row.status === "recusado" ? "bg-[#fde8e8] text-[#7f1d1d] ring-[#f5b5b5]" : "bg-paper text-ink-2 ring-line"}`}>Fechado: <b>{req.row.status}</b>{req.row.reviewedBy ? ` por ${req.row.reviewedBy}` : ""}{req.row.publishedVersion ? ` → publicado como v${req.row.publishedVersion}` : ""}{req.row.reviewNote ? <>{req.row.status === "recusado" ? ". Motivo da recusa: " : ". "}<b>“{req.row.reviewNote}”</b></> : null}</p> : null}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Mudanças" value={String(plan.changes.length)} note={plan.sections.join(" · ")} color="#6d3fc4" small />
        <Kpi label="Questionários afetados" value={im ? String(im.ideologyChanged) : "0"} note={im ? `de ${im.total} mudam de ideologia` : ""} color="#ec4899" />
        <Kpi label="Perguntas" value={im ? `${im.questions.before} → ${im.questions.after}` : "—"} color="#2f9a5d" small />
        <Kpi label="Versão" value={`v${pub.version} → nova`} color="#2563eb" small />
      </section>

      {plan.errors.length ? <Panel title="Corrija antes de aprovar" accent="#dc2626"><ul className="list-disc space-y-1 pl-5 text-sm text-[#9b1c1c]">{plan.errors.map((e) => <li key={e}>{e}</li>)}</ul></Panel> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="O que muda" subtitle="Em relação ao que está no ar">
          <ul className="max-h-96 space-y-1.5 overflow-y-auto text-sm">
            {plan.changes.map((c, i) => (
              <li key={i} className="flex gap-2 rounded-lg bg-paper/60 px-3 py-2 ring-1 ring-line">
                <span className="mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: SECTION_COLOR[c.section] }}>{c.section}</span>
                <span className="text-ink-2">{c.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Impacto no cálculo" subtitle={!plan.sections.some((x) => CALC.includes(x)) ? "Mudança só de texto: não mexe na conta" : im ? `Com os ${im.total} questionários já enviados` : ""}>
          {!plan.sections.some((x) => CALC.includes(x)) ? <p className="rounded-lg bg-mint-soft px-3 py-2 text-sm font-semibold text-mint-strong">Nenhuma conta muda: só o texto que aparece no site.</p> : im ? (
            <div className="space-y-3 text-sm">
              <ul className="space-y-1.5">{im.summary.map((s) => <li key={s} className="rounded-lg bg-[#fff4e5] px-3 py-2 font-semibold text-[#7a4a00] ring-1 ring-[#f5c27a]">{s}</li>)}</ul>
              <table className="w-full text-xs">
                <thead><tr className="text-left text-ink-3"><th className="py-1">Métrica</th><th>Antes</th><th>Depois</th></tr></thead>
                <tbody>
                  {im.ruler.map((r) => <tr key={`r${r.candidate}`} className="border-t border-line"><td className="py-1.5">Mais perto de {CANDIDATE_SHORT[r.candidate]} (régua)</td><td>{pct(r.before)}</td><td className="font-bold">{pct(r.after)}</td></tr>)}
                  {im.profile.map((r) => <tr key={`p${r.candidate}`} className="border-t border-line"><td className="py-1.5">Mais perto de {CANDIDATE_SHORT[r.candidate]} (temas)</td><td>{pct(r.before)}</td><td className="font-bold">{pct(r.after)}</td></tr>)}
                </tbody>
              </table>
              {im.ideologyMoves.length ? <ul className="space-y-1 text-xs">{im.ideologyMoves.map((m) => <li key={m.from + m.to}>{m.from} → <b>{m.to}</b>: {m.count}</li>)}</ul> : null}
            </div>
          ) : <p className="text-sm text-ink-3">—</p>}
        </Panel>
      </div>

      <Panel title="Prévia do que foi editado" subtitle="No ar × com o pedido, só o que mudou">
        <div className="space-y-4">
          <ChangePreview live={pub.cfg} target={plan.target} />
          {plan.sections.some((x) => CALC.includes(x)) ? (
            <>
              <MiniRuler cfg={pub.cfg} label={`Régua no ar (v${pub.version})`} />
              <MiniRuler cfg={plan.target} label="Régua com o pedido" highlight />
              {plan.examples.length ? <div className="grid gap-2 md:grid-cols-2">{plan.examples.map((e, i) => <div key={i} className="rounded-lg bg-paper/60 p-3 text-xs ring-1 ring-line"><p className="font-bold text-ink-3">Exemplo {i + 1}</p><p className="mt-1">Ideologia: {e.before} → <b>{e.after}</b></p><p>Mais perto na régua: {e.rulerBefore} → <b>{e.rulerAfter}</b></p></div>)}</div> : null}
            </>
          ) : null}
        </div>
      </Panel>

      {isOpen ? (
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Panel title="Aceitar" subtitle="Veja como o site vai ficar e confirme com o código" accent="#2f9a5d">
            {plan.errors.length || stale ? <p className="text-sm font-semibold text-[#9b1c1c]">Não dá para aceitar: {stale ? "pedido desatualizado" : "há problemas a corrigir"}.</p> : (
              <Link href={`/admin/publicar/${id}/previa`} className="inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-[#15803d] to-[#2f9a5d] px-5 py-2.5 text-sm font-bold text-white shadow-sm">Aceitar → ver prévia e confirmar</Link>
            )}
          </Panel>
          <Panel title="Recusar" subtitle="O pedido fecha; as mudanças podem voltar ao rascunho depois." accent="#9b1c1c">
            <form action={rejectAction} className="space-y-3">
              <input type="hidden" name="request" value={id} />
              <label className="block text-xs font-semibold text-ink-2">Seu nome *<input name="author" required minLength={2} maxLength={60} className={input} /></label>
              <label className="block text-xs font-semibold text-ink-2">Motivo da recusa * <span className="font-normal text-ink-3">(não precisa para cancelar)</span><textarea name="note" rows={3} maxLength={600} className={input} placeholder="Ex.: a nota do Flávio no SUS precisa de fonte" /></label>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-[#9b1c1c] px-3 py-2 text-sm font-bold text-white">Recusar</button>
                <button name="cancel" value="1" className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-ink-2 ring-1 ring-line">Cancelar meu pedido</button>
              </div>
            </form>
          </Panel>
        </div>
      ) : req.row.status !== "aprovado" ? (
        <form action={reopenAction}><input type="hidden" name="request" value={id} /><button className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-ink-2 ring-1 ring-line">Levar estas mudanças de volta ao rascunho</button></form>
      ) : null}
      <Panel title="Comentários" subtitle="Converse sobre o pedido antes de aceitar ou recusar. Nome e comentário são obrigatórios.">
        <CommentThread target="pedido" targetId={id} comments={comments} />
      </Panel>
      <Link href="/admin/publicar" className="text-sm font-semibold text-purple underline">← Publicar</Link>
    </AdminShell>
  );
}
