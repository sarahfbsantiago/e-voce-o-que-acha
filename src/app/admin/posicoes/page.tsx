import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { PosicoesSection } from "@/components/admin/sections/PosicoesSection";

export const metadata: Metadata = { title: "Revisão de posições", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <AdminShell current="/admin/posicoes"><PosicoesSection /></AdminShell>;
}
