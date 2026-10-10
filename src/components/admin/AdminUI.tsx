import type { ReactNode } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { logoutAction } from "@/app/admin/login/actions";
import { BrazilMark } from "@/components/brand/BrazilMark";
import { adminSessionExpiresAt } from "@/lib/admin-auth";
import { getDraft, getPublishedConfig, liveVersionMeta } from "@/lib/live-config-server";
import { getPrisma } from "@/lib/prisma";
import { dataSourceMode } from "@/lib/env";
import { diffConfig } from "@/lib/live-config";
import { AdminSessionClock } from "./AdminSessionClock";

/**
 * Peças visuais comuns do painel administrativo (estilo dashboard): fundo cinza claro, cabeçalho em degradê,
 * números em cartões e conteúdo em painéis brancos arredondados.
 */
export async function AdminShell({ current, children }: { current: string; children: ReactNode }) {
  const pending = await draftChangeCount();
  const meta = await liveVersionMeta().catch(() => null);
  const openRequests = await countOpenRequests();
  return (
    <div className="min-h-screen bg-[#f3f2ef] print:bg-white">
      <AdminTopBar />
      <div className="container-page space-y-5 py-6">
        <AdminNav current={current} />
        {HELP[current] ? (
          <a href={`/admin#${HELP[current]}`} className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-purple to-[#2563eb] text-lg font-bold text-white shadow-lg ring-4 ring-white/70 print:hidden" title="Como usar esta página" aria-label="Como usar esta página">?</a>
        ) : null}
        {meta ? (
          <p className="flex flex-wrap items-center gap-2 text-xs text-ink-3 print:hidden">
            <span className="rounded-full bg-mint px-2 py-0.5 font-bold text-white">no ar: v{meta.id}</span>
            publicada em {meta.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })} por <b className="text-ink-2">{meta.author}</b>{meta.approvedBy ? <> · aprovada por <b className="text-ink-2">{meta.approvedBy}</b></> : null}
            {openRequests ? <Link href="/admin/publicar" className="rounded-full bg-purple-soft px-2 py-0.5 font-bold text-purple-strong">{openRequests} aguardando aprovação →</Link> : null}
          </p>
        ) : null}
        {pending > 0 && current !== "/admin/publicar" ? (
          <Link href="/admin/publicar" className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#fff4e5] px-4 py-3 text-sm ring-1 ring-[#f5c27a] hover:bg-[#ffecd1] print:hidden">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f97316] text-xs font-bold text-white">{pending}</span>
            <span className="font-semibold text-[#7a4a00]">{pending === 1 ? "mudança no rascunho, ainda não publicada" : "mudanças no rascunho, ainda não publicadas"}</span>
            <span className="ml-auto font-bold text-[#9a3412]">Enviar para aprovação →</span>
          </Link>
        ) : null}
        {children}
        {pending > 0 && current !== "/admin/publicar" ? <div aria-hidden="true" className="h-16" /> : null}
      </div>
      {pending > 0 && current !== "/admin/publicar" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#f5c27a] bg-[#fff4e5]/95 backdrop-blur print:hidden">
          <div className="container-page flex flex-wrap items-center gap-3 py-2.5 pr-16">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f97316] text-xs font-bold text-white">{pending}</span>
            <span className="text-sm font-semibold text-[#7a4a00]">{pending === 1 ? "mudança no rascunho" : "mudanças no rascunho"} · ainda não está no site</span>
            <Link href="/admin/publicar" className="ml-auto rounded-xl bg-surface px-3 py-2 text-xs font-bold text-ink-2 ring-1 ring-line">Revisar ou excluir rascunho</Link>
            <Link href="/admin/publicar" className="rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2 text-sm font-bold text-white shadow-sm">Enviar tudo para aprovação</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminHero({ kicker, title, subtitle, pdfTitle, extra }: { kicker: string; title: string; subtitle: string; pdfTitle: string; extra?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-4 text-white shadow-md md:p-5">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{kicker}</p>
        <h1 className="mt-1 text-xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-white/85">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {extra}
        <a href="/admin/completo" title={`PDF com todas as seções (inclui ${pdfTitle})`} className="inline-flex min-h-10 items-center rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25">PDF completo</a>
        <form action={logoutAction}><button className="min-h-10 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-strong">Sair</button></form>
      </div>
    </header>
  );
}

export function Kpi({ label, value, note, color, small = false }: { label: string; value: string; note?: string; color: string; small?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5 print:break-inside-avoid print:border print:border-line">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <p className={`mt-1 font-bold tabular-nums text-ink ${small ? "text-base leading-tight md:text-lg" : "text-2xl md:text-3xl"}`}>{value}</p>
      {note ? <p className="mt-0.5 text-xs text-ink-2">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, subtitle, children, className = "", accent, right }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; className?: string; accent?: string; right?: ReactNode }) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 print:break-inside-avoid print:border print:border-line ${className}`}>
      {accent ? <div aria-hidden="true" className="h-1.5" style={{ background: accent }} /> : null}
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-ink">{title}</h2>
            {subtitle ? <p className="text-xs text-ink-3">{subtitle}</p> : null}
          </div>
          {right}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

/** Título de uma seção do questionário (cor da área). */
export function SectionTitle({ n, label, color, note }: { n: number; label: string; color: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl text-sm font-bold text-white shadow-sm" style={{ background: color }}>{n}</span>
      <h2 className="text-lg font-bold text-ink">{label}</h2>
      {note ? <span className="text-xs text-ink-3">{note}</span> : null}
    </div>
  );
}

/** Número da pergunta em destaque. */
export function QNum({ n, title }: { n: number; title?: string }) {
  return <span title={title} className="mr-2 inline-grid h-6 min-w-6 place-items-center rounded-md bg-purple px-1.5 text-[11px] font-bold text-white">{n}</span>;
}

/** Cabeçalho próprio do admin: só a logo, "Admin" e o relógio da sessão (o cabeçalho do site não aparece aqui). */
export async function AdminTopBar() {
  const expiresAt = await adminSessionExpiresAt();
  return (
    <div className="border-b border-black/5 bg-surface print:hidden">
      <div className="container-page flex h-14 items-center gap-2.5">
        <BrazilMark size={26} className="shrink-0" />
        <span className="text-base font-bold text-ink">Admin</span>
        {expiresAt ? <span className="ml-auto"><AdminSessionClock expiresAt={expiresAt} /></span> : null}
      </div>
    </div>
  );
}

/** Âncora do tutorial para cada página (botão ? no canto). */
const HELP: Record<string, string> = { "/admin/research": "secoes", "/admin/posicoes": "secoes", "/admin/notas": "notas", "/admin/espectro": "regua", "/admin/perguntas": "perguntas", "/admin/publicar": "publicar", "/admin/historico": "historico", "/admin/sugestoes": "sugestoes", "/admin/textos": "textos", "/admin/fontes": "textos" };

/** Quantas mudanças o rascunho tem em relação à versão no ar (0 sem rascunho ou sem banco). */
async function draftChangeCount(): Promise<number> {
  try {
    const draft = await getDraft();
    if (!draft) return 0;
    const pub = await getPublishedConfig();
    return diffConfig(pub.cfg, draft.cfg).length;
  } catch { return 0; }
}

async function countOpenRequests(): Promise<number> {
  if (dataSourceMode() !== "prisma") return 0;
  try { return await getPrisma().publishRequest.count({ where: { status: "aberto" } }); } catch { return 0; }
}
