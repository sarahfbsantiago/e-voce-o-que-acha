import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { PrintOnLoad } from "@/components/admin/PrintOnLoad";
import { AUTH_STEPS, TIPS } from "@/components/admin/tips";
import { AuthIllustrations } from "@/components/admin/AuthIllustrations";

export const metadata: Metadata = { title: "Manual do admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Manual completo do admin para salvar em PDF: todos os tópicos abertos (sem a chave do autenticador). */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const all: { icon: string; title: string; color: string; points: [string, string][] }[] = [
    { icon: "🔐", title: "Registrar no Google Authenticator", color: "#15803d", points: AUTH_STEPS },
    ...TIPS,
  ];
  return (
    <AdminShell current="/admin">
      <PrintOnLoad fileTitle="Manual do admin" />
      <header className="rounded-2xl bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">E Você, O Que Acha?</p>
        <h1 className="mt-1 text-2xl font-bold">Manual do admin</h1>
        <p className="mt-1 text-sm text-white/85">Como editar, enviar para aprovação, aprovar, publicar e voltar versões. Gerado em {new Date().toLocaleDateString("pt-BR")}.</p>
      </header>
      <ol className="rounded-2xl bg-surface p-4 text-sm ring-1 ring-line print:break-inside-avoid">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">Sumário</p>
        {all.map((t, i) => <li key={t.title} className="py-0.5">{i + 1}. {t.icon} {t.title}</li>)}
      </ol>
      {all.map((t, i) => (
        <section key={t.title} className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line print:break-inside-avoid print:border print:border-line">
          <div className="h-1.5" style={{ background: t.color }} />
          <div className="p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><span className="grid h-8 w-8 place-items-center rounded-lg text-base text-white" style={{ background: t.color }}>{t.icon}</span>{i + 1}. {t.title}</h2>
            {i === 0 ? <div className="mt-3"><AuthIllustrations /></div> : null}
            <ol className="mt-3 space-y-2">
              {t.points.map(([a, b], j) => (
                <li key={j} className="flex gap-3 rounded-xl p-2.5" style={{ background: `${t.color}12` }}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: t.color }}>{j + 1}</span>
                  <span className="text-sm leading-relaxed text-ink-2"><b style={{ color: t.color }}>{a}</b> {b}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </AdminShell>
  );
}
