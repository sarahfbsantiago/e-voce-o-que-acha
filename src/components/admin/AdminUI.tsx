import type { ReactNode } from "react";
import { AdminNav } from "@/components/AdminNav";
import { PrintButton } from "@/components/PrintButton";
import { logoutAction } from "@/app/admin/login/actions";
import { BrazilMark } from "@/components/brand/BrazilMark";
import { adminSessionExpiresAt } from "@/lib/admin-auth";
import { AdminSessionClock } from "./AdminSessionClock";

/**
 * Peças visuais comuns do painel administrativo (estilo dashboard): fundo cinza claro, cabeçalho em degradê,
 * números em cartões e conteúdo em painéis brancos arredondados.
 */
export function AdminShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <AdminTopBar />
      <div className="container-page space-y-5 py-6">
        <AdminNav current={current} />
        {children}
      </div>
    </div>
  );
}

export function AdminHero({ kicker, title, subtitle, pdfTitle, extra }: { kicker: string; title: string; subtitle: string; pdfTitle: string; extra?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-5 text-white shadow-md">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{kicker}</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-white/85">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {extra}
        <PrintButton label="PDF" fileTitle={pdfTitle} />
        <form action={logoutAction}><button className="min-h-10 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-strong">Sair</button></form>
      </div>
    </header>
  );
}

export function Kpi({ label, value, note, color, small = false }: { label: string; value: string; note?: string; color: string; small?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <p className={`mt-1 font-bold tabular-nums text-ink ${small ? "text-lg leading-tight" : "text-3xl"}`}>{value}</p>
      {note ? <p className="mt-0.5 text-xs text-ink-2">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, subtitle, children, className = "", accent, right }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; className?: string; accent?: string; right?: ReactNode }) {
  return (
    <section className={`overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 ${className}`}>
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
