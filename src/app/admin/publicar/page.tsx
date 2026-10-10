import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { PublishForm } from "@/components/admin/PublishForm";
import { MiniRuler } from "@/components/admin/MiniRuler";
import { buildPublishPlan } from "@/lib/publish-plan";
import { discardDraftAction } from "../config-actions";
import { CANDIDATE_SHORT } from "@/lib/live-config";

export const metadata: Metadata = { title: "Revisar e publicar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  bloqueado: "Muitas tentativas erradas de código. Espere 10 minutos.",
  "sem-mudancas": "Não há mudanças para publicar.",
  invalido: "Há problemas que impedem publicar (veja a lista em vermelho).",
  nome: "Digite seu nome.",
  motivo: "Escreva o motivo da mudança.",
  ciente: "Marque \"Estou ciente\".",
  frase: "A frase digitada não confere.",
  codigo: "Código do Google Authenticator inválido ou já usado. Use o código atual do aplicativo.",
};
const SECTION_COLOR: Record<string, string> = { "Notas por alternativa": "#6d3fc4", "Espectro político": "#2563eb", "Régua": "#ec4899", "Perguntas": "#2f9a5d" };
const pct = (n: number | null) => (n === null ? "—" : `${String(n).replace(".", ",")}%`);

export default async function Page({ searchParams }: { searchParams: Promise<{ rollback?: string; erro?: string; descartado?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const rollback = Number(sp.rollback ?? 0) || null;
  const plan = await buildPublishPlan(rollback);
  if (!plan) redirect("/admin/historico");
  const im = plan.impact;
  const nothing = !plan.changes.length;

  return (
    <AdminShell current="/admin/publicar">
      <AdminHero kicker={rollback ? "Histórico · rollback" : "Rascunho"} title={rollback ? `Voltar para a versão v${rollback}` : "Revisar e publicar"} pdfTitle="Revisar e publicar"
        subtitle={rollback ? `Restaura exatamente a versão v${rollback}. Vira uma nova versão no histórico; nada é apagado.` : "Confira o que muda, o impacto nos questionários já enviados e publique. Até publicar, nada muda no site."} />

      {sp.erro ? <p className="rounded-2xl bg-[#fde8e8] p-4 text-sm font-semibold text-[#9b1c1c] ring-1 ring-[#f5b5b5]">{ERRORS[sp.erro] ?? "Não foi possível publicar."}</p> : null}
      {sp.descartado ? <p className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-strong">Rascunho descartado.</p> : null}

      {nothing ? (
        <Panel title="Nada para publicar" subtitle="O rascunho está igual à versão publicada.">
          <p className="text-sm text-ink-2">Faça mudanças em <Link className="font-semibold text-purple underline" href="/admin/notas">Notas</Link>, <Link className="font-semibold text-purple underline" href="/admin/espectro">Espectro político</Link> ou <Link className="font-semibold text-purple underline" href="/admin/perguntas">Perguntas</Link>; elas ficam no rascunho até você publicar aqui.</p>
        </Panel>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kpi label="Mudanças" value={String(plan.changes.length)} note={plan.sections.join(" · ")} color="#6d3fc4" small />
            <Kpi label="Questionários afetados" value={im ? String(im.ideologyChanged) : "—"} note={im ? `de ${im.total} mudam de ideologia` : ""} color="#ec4899" />
            <Kpi label="Perguntas" value={im ? `${im.questions.before} → ${im.questions.after}` : "—"} note="no questionário" color="#2f9a5d" small />
            <Kpi label="Versão" value={`v${plan.published.version} → nova`} note={rollback ? `conteúdo igual à v${rollback}` : "a publicada continua no histórico"} color="#2563eb" small />
          </section>

          {plan.errors.length ? (
            <Panel title="Corrija antes de publicar" accent="#dc2626">
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#9b1c1c]">{plan.errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </Panel>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="O que muda" subtitle="Antes → depois">
              <ul className="max-h-96 space-y-1.5 overflow-y-auto text-sm">
                {plan.changes.map((c, i) => (
                  <li key={i} className="flex gap-2 rounded-lg bg-paper/60 px-3 py-2 ring-1 ring-line">
                    <span className="mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: SECTION_COLOR[c.section] }}>{c.section}</span>
                    <span className="text-ink-2">{c.text}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Impacto no cálculo" subtitle={im ? `Calculado com os ${im.total} questionários já enviados` : ""}>
              {im ? (
                <div className="space-y-3 text-sm">
                  <ul className="space-y-1.5">{im.summary.map((s) => <li key={s} className="rounded-lg bg-[#fff4e5] px-3 py-2 font-semibold text-[#7a4a00] ring-1 ring-[#f5c27a]">{s}</li>)}</ul>
                  <table className="w-full text-xs">
                    <thead><tr className="text-left text-ink-3"><th className="py-1">Métrica</th><th>Antes</th><th>Depois</th></tr></thead>
                    <tbody>
                      {im.ruler.map((r) => <tr key={`r${r.candidate}`} className="border-t border-line"><td className="py-1.5">Mais perto de {CANDIDATE_SHORT[r.candidate]} (régua)</td><td>{pct(r.before)}</td><td className="font-bold">{pct(r.after)}</td></tr>)}
                      {im.profile.map((r) => <tr key={`p${r.candidate}`} className="border-t border-line"><td className="py-1.5">Mais perto de {CANDIDATE_SHORT[r.candidate]} (temas)</td><td>{pct(r.before)}</td><td className="font-bold">{pct(r.after)}</td></tr>)}
                    </tbody>
                  </table>
                  {im.ideologyMoves.length ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Para onde as pessoas mudam</p>
                      <ul className="mt-1 space-y-1 text-xs">{im.ideologyMoves.map((m) => <li key={m.from + m.to}>{m.from} → <b>{m.to}</b>: {m.count}</li>)}</ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Panel>
          </div>

          <Panel title="Pré-visualização" subtitle="Régua antes e depois, e exemplos reais de questionários que mudam">
            <div className="space-y-4">
              <MiniRuler cfg={plan.published.cfg} label={`Antes (v${plan.published.version})`} />
              <MiniRuler cfg={plan.target} label="Depois" highlight />
              {plan.examples.length ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {plan.examples.map((e, i) => (
                    <div key={i} className="rounded-lg bg-paper/60 p-3 text-xs ring-1 ring-line">
                      <p className="font-bold text-ink-3">Questionário de exemplo {i + 1}</p>
                      <p className="mt-1">Ideologia: {e.before} → <b>{e.after}</b></p>
                      <p>Mais perto na régua: {e.rulerBefore} → <b>{e.rulerAfter}</b></p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-ink-3">Nenhum questionário de exemplo muda de ideologia ou de lado na régua.</p>}
            </div>
          </Panel>

          <Panel title={rollback ? "Confirmar a volta de versão" : "Confirmar a publicação"} subtitle="Igual ao GitHub: só publica com a frase exata e o código." accent="#dc2626">
            {plan.errors.length ? <p className="text-sm font-semibold text-[#9b1c1c]">Corrija os problemas acima para liberar a publicação.</p> : (
              <PublishForm phrase={plan.phrase} rollback={rollback} needsCode={adminTotpSecret() !== null} danger={(im?.ideologyChanged ?? 0) > 0} />
            )}
          </Panel>

          {!rollback ? (
            <form action={discardDraftAction} className="text-right">
              <button className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-ink-3 ring-1 ring-line hover:text-[#9b1c1c]">Descartar o rascunho</button>
            </form>
          ) : null}
        </>
      )}
    </AdminShell>
  );
}
