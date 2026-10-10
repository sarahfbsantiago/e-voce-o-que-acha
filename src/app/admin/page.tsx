import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell } from "@/components/admin/AdminUI";
import { Modal } from "@/components/Modal";
import { SecretField } from "@/components/admin/SecretField";
import { Icon, type IconName } from "@/components/admin/Icon";
import { AuthIllustrations } from "@/components/admin/AuthIllustrations";
import { adminTotpSecret } from "@/lib/env";
import { AUTH_STEPS, TIPS } from "@/components/admin/tips";

export const metadata: Metadata = { title: "Como usar o admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";


/** Como usar o admin: botões coloridos; cada um abre a explicação num pop-up. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return (
    <AdminShell current="/admin">
      <AdminHero kicker="Comece aqui" title="Como usar o admin" subtitle="Toque num tema para ver o passo a passo." extra={<a href="/admin/manual" className="inline-flex min-h-10 items-center rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25">Exportar PDF</a>} />

      <ol className="flex flex-wrap items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-soft to-[#dbeafe] p-4 text-xs font-bold text-ink ring-1 ring-purple/20 sm:text-sm">
        {([["pencil", "Editar"], ["save", "Salvar no rascunho"], ["send", "Enviar para aprovação"], ["eye", "Revisar e prévia"], ["key", "Código"], ["rocket", "No ar"], ["history", "Histórico"]] as [IconName, string][]).map(([ic, t], i, a) => (
          <li key={t} className="flex items-center gap-2"><span className="admin-lift inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-2 shadow-sm ring-1 ring-line"><Icon name={ic} className="h-4 w-4 text-purple" />{t}</span>{i < a.length - 1 ? <span className="text-purple">→</span> : null}</li>
        ))}
      </ol>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <li id="autenticador" className="scroll-mt-6">
          <Modal plainTrigger title="Registrar no Google Authenticator" className="group admin-lift h-full w-full rounded-2xl bg-surface p-4 text-left shadow-sm ring-1 ring-black/5"
            trigger={
              <span className="flex h-full flex-col gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#15803d] text-white shadow-sm"><Icon name="shield" className="h-6 w-6" /></span>
                <span className="text-sm font-bold text-ink">Registrar no Google Authenticator</span>
                <span className="text-xs text-ink-3">a chave para cadastrar o código</span>
                <span className="mt-auto text-xs font-bold text-[#15803d]">Ver como →</span>
              </span>
            }>
            <div className="space-y-3">
              <AuthIllustrations />
              <ul className="space-y-2.5">
                {AUTH_STEPS.map(([a, b], i) => (
                  <li key={i} className="flex gap-3 rounded-xl bg-[#15803d12] p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#15803d] text-[11px] font-bold text-white">{i + 1}</span>
                    <span className="text-sm leading-relaxed text-ink-2"><b className="text-[#15803d]">{a}</b> {b}</span>
                  </li>
                ))}
              </ul>
              {adminTotpSecret() ? <SecretField value={adminTotpSecret()!.replace(/[^A-Za-z2-7]/g, "").toUpperCase()} /> : <p className="rounded-xl bg-paper p-3 text-sm text-ink-3">O autenticador não está ativado neste ambiente.</p>}
              <p className="rounded-xl bg-[#fde8e8] p-3 text-xs text-[#7f1d1d]">Não envie esta chave por mensagem nem e-mail: com ela, qualquer pessoa gera os códigos de acesso. Perdeu o celular? Peça uma chave nova.</p>
            </div>
          </Modal>
        </li>
        {TIPS.map((t) => (
          <li key={t.id} id={t.id} className="scroll-mt-6">
            <Modal plainTrigger title={t.title} className="group admin-lift h-full w-full rounded-2xl bg-surface p-4 text-left shadow-sm ring-1 ring-black/5"
              trigger={
                <span className="flex h-full flex-col gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-110 group-hover:-rotate-3" style={{ background: t.color }}><Icon name={t.icon} className="h-6 w-6" /></span>
                  <span className="text-sm font-bold text-ink">{t.title}</span>
                  <span className="text-xs text-ink-3">{t.short}</span>
                  <span className="mt-auto text-xs font-bold" style={{ color: t.color }}>Ver como →</span>
                </span>
              }>
              <ul className="space-y-2.5">
                {t.points.map(([a, b], i) => (
                  <li key={i} className="flex gap-3 rounded-xl p-3" style={{ background: `${t.color}12` }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: t.color }}>{i + 1}</span>
                    <span className="text-sm leading-relaxed text-ink-2"><b style={{ color: t.color }}>{a}</b> {b}</span>
                  </li>
                ))}
              </ul>
            </Modal>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
