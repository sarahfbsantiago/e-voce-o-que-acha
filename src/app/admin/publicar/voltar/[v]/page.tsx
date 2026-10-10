import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Panel } from "@/components/admin/AdminUI";
import { getVersion } from "@/lib/live-config-server";
import { requestRollbackAction } from "../../actions";

export const metadata: Metadata = { title: "Pedir volta de versão", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Pedir a volta para uma versão antiga: vira um pedido para aprovação. */
export default async function Page({ params }: { params: Promise<{ v: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const v = Number((await params).v);
  const ver = await getVersion(v);
  if (!ver) notFound();
  const input = "mt-1 w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm";
  return (
    <AdminShell current="/admin/historico">
      <AdminHero kicker="Histórico · rollback" title={`Voltar para a versão v${v}`} pdfTitle={`Voltar v${v}`} subtitle={`${ver.row.author} · ${ver.row.reason}. O pedido vai para a aba Publicar, onde é revisado e aprovado com frase e código.`} />
      <Panel title="Enviar pedido de volta" accent="#ec4899">
        <form action={requestRollbackAction} className="grid max-w-xl gap-3">
          <input type="hidden" name="version" value={v} />
          <label className="text-xs font-semibold text-ink-2">Seu nome *<input name="author" required minLength={2} maxLength={60} className={input} /></label>
          <label className="text-xs font-semibold text-ink-2">Por que voltar? *<textarea name="note" required minLength={3} maxLength={600} rows={3} className={input} /></label>
          <button className="w-fit rounded-xl bg-[#ec4899] px-4 py-2 text-sm font-bold text-white">Enviar para aprovação</button>
        </form>
      </Panel>
    </AdminShell>
  );
}
