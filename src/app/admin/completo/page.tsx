import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { PrintOnLoad } from "@/components/admin/PrintOnLoad";
import { PesquisaSection } from "@/components/admin/sections/PesquisaSection";
import { PosicoesSection } from "@/components/admin/sections/PosicoesSection";
import { NotasSection } from "@/components/admin/sections/NotasSection";
import { EspectroSection } from "@/components/admin/sections/EspectroSection";

export const metadata: Metadata = { title: "Relatório completo do admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Todas as seções do admin numa página só, para o PDF (cada seção começa numa página nova). */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return (
    <AdminShell current="/admin/completo">
      <PrintOnLoad fileTitle="Admin completo" />
      <p className="rounded-2xl bg-surface p-4 text-sm text-ink-2 shadow-sm ring-1 ring-black/5 print:hidden">
        A janela para salvar o PDF abre sozinha. Se não abrir, use Cmd+P (ou Ctrl+P) e escolha &quot;Salvar como PDF&quot;.
      </p>
      <div className="space-y-5"><PesquisaSection /></div>
      <div className="space-y-5 break-before-page"><PosicoesSection /></div>
      <div className="space-y-5 break-before-page"><NotasSection /></div>
      <div className="space-y-5 break-before-page"><EspectroSection /></div>
    </AdminShell>
  );
}
