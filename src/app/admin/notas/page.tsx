import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { NotasSection } from "@/components/admin/sections/NotasSection";

export const metadata: Metadata = { title: "Notas por alternativa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <AdminShell current="/admin/notas"><NotasSection /></AdminShell>;
}
